"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiftPlanningService = void 0;
const uuid_1 = require("uuid");
const database_1 = require("@/database/database");
const logger_1 = require("@/utils/logger");
class ShiftPlanningService {
    static async generateShiftPlan(request) {
        const { year, month, employeeIds, useRelaxedRules = false } = request;
        logger_1.loggers.service(`Generiere Schichtplan für ${month}/${year}`, {
            employeeCount: employeeIds?.length || 'alle',
            useRelaxedRules
        });
        try {
            const employees = await this.loadEmployees(employeeIds);
            if (employees.length === 0) {
                throw new Error('Keine Mitarbeiter für Schichtplanung verfügbar');
            }
            const shiftRules = await this.loadShiftRules();
            const { shiftPlan, employeeAvailability } = this.generateBasicShiftPlan(employees, year, month, useRelaxedRules);
            const violations = this.validateShiftPlan(shiftPlan, employees, employeeAvailability, shiftRules);
            const statistics = this.calculateStatistics(shiftPlan, employees, employeeAvailability, year, month);
            const savedPlan = await this.saveShiftPlan({
                year,
                month,
                planData: shiftPlan,
                employeeAvailability,
                statistics
            });
            if (violations.hard.length > 0 || violations.soft.length > 0) {
                await this.saveConstraintViolations(savedPlan.id, violations);
            }
            logger_1.loggers.service(`Schichtplan erfolgreich generiert`, {
                planId: savedPlan.id,
                hardViolations: violations.hard.length,
                softViolations: violations.soft.length,
                completionRate: statistics.completionRate
            });
            return {
                shiftPlan,
                employeeAvailability,
                violations,
                statistics
            };
        }
        catch (error) {
            logger_1.loggers.error('Fehler bei Schichtplan-Generierung', error, { year, month });
            throw error;
        }
    }
    static async loadEmployees(employeeIds) {
        let query = 'SELECT * FROM employees WHERE is_active = 1';
        const params = [];
        if (employeeIds && employeeIds.length > 0) {
            query += ` AND id IN (${employeeIds.map(() => '?').join(',')})`;
            params.push(...employeeIds);
        }
        query += ' ORDER BY role, name';
        const stmt = database_1.db.prepare(query);
        const rows = stmt.all(...params);
        return rows.map(row => ({
            id: row.id,
            name: row.name,
            role: row.role,
            hoursPerMonth: row.hours_per_month,
            hoursPerWeek: row.hours_per_week,
            location: row.location,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at)
        }));
    }
    static async loadShiftRules() {
        const stmt = database_1.db.prepare('SELECT * FROM shift_rules WHERE is_active = 1 ORDER BY created_at DESC LIMIT 1');
        const row = stmt.get();
        if (!row) {
            return {
                minNursesPerShift: 4,
                minNurseManagersPerShift: 1,
                minHelpers: 1,
                maxSaturdaysPerMonth: 1,
                maxConsecutiveSameShifts: 0,
                weeklyHoursOverflowTolerance: 0.1
            };
        }
        return {
            minNursesPerShift: row.min_nurses_per_shift,
            minNurseManagersPerShift: row.min_nurse_managers_per_shift,
            minHelpers: row.min_helpers,
            maxSaturdaysPerMonth: row.max_saturdays_per_month,
            maxConsecutiveSameShifts: row.max_consecutive_same_shifts,
            weeklyHoursOverflowTolerance: row.weekly_hours_overflow_tolerance
        };
    }
    static generateBasicShiftPlan(employees, year, month, useRelaxedRules) {
        const shiftPlan = {};
        const employeeAvailability = {};
        employees.forEach(emp => {
            employeeAvailability[emp.id] = {
                weeklyHoursAssigned: 0,
                totalHoursAssigned: 0,
                shiftsAssigned: [],
                lastShiftType: null,
                saturdaysWorked: 0
            };
        });
        const daysInMonth = new Date(year, month, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month - 1, day);
            const dayKey = this.formatDateKey(date);
            const dayOfWeek = date.getDay();
            if (dayOfWeek === 0) {
                shiftPlan[dayKey] = null;
                continue;
            }
            if (dayOfWeek === 6) {
                const saturdayCount = this.countSaturdaysUpToDate(year, month, day);
                if (saturdayCount > 2) {
                    shiftPlan[dayKey] = null;
                    continue;
                }
            }
            shiftPlan[dayKey] = this.planDayShifts(employees, employeeAvailability, date, useRelaxedRules);
        }
        return { shiftPlan, employeeAvailability };
    }
    static planDayShifts(employees, availability, date, useRelaxedRules) {
        const dayShifts = {};
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 6 || dayOfWeek === 0;
        const schichtleiter = employees.filter(emp => emp.role === 'ShiftLeader');
        const pfleger = employees.filter(emp => emp.role === 'Specialist');
        const pflegehelfer = employees.filter(emp => emp.role === 'Assistant');
        if (isWeekend) {
            dayShifts['F'] = this.assignEmployeesToShift([...schichtleiter, ...pfleger, ...pflegehelfer].slice(0, 3), availability, date, 'F', 7);
            dayShifts['FS'] = this.assignEmployeesToShift([...schichtleiter, ...pfleger].slice(0, 1), availability, date, 'FS', 7.25);
        }
        else {
            dayShifts['F'] = this.assignEmployeesToShift([...schichtleiter.slice(0, 1), ...pfleger.slice(0, 3), ...pflegehelfer.slice(0, 1)], availability, date, 'F', 8);
            dayShifts['S'] = this.assignEmployeesToShift([...schichtleiter.slice(1, 2), ...pfleger.slice(3, 6), ...pflegehelfer.slice(1, 2)], availability, date, 'S', 8);
            dayShifts['S0'] = this.assignEmployeesToShift([...pfleger.slice(6, 8)], availability, date, 'S0', 4);
        }
        return dayShifts;
    }
    static assignEmployeesToShift(employees, availability, date, shiftType, hours) {
        const assigned = [];
        const dateKey = this.formatDateKey(date);
        for (const emp of employees) {
            if (availability[emp.id].shiftsAssigned.includes(dateKey)) {
                continue;
            }
            if (availability[emp.id].totalHoursAssigned + hours > emp.hoursPerMonth * 1.1) {
                continue;
            }
            assigned.push(emp.id);
            availability[emp.id].totalHoursAssigned += hours;
            availability[emp.id].shiftsAssigned.push(dateKey);
            availability[emp.id].lastShiftType = shiftType;
            if (date.getDay() === 6) {
                availability[emp.id].saturdaysWorked += 1;
            }
        }
        return assigned;
    }
    static validateShiftPlan(shiftPlan, employees, availability, rules) {
        const hardViolations = [];
        const softViolations = [];
        for (const [dateKey, dayPlan] of Object.entries(shiftPlan)) {
            if (!dayPlan)
                continue;
            for (const [shiftName, employeeIds] of Object.entries(dayPlan)) {
                if (employeeIds.length < rules.minNursesPerShift) {
                    hardViolations.push({
                        id: (0, uuid_1.v4)(),
                        shiftPlanId: '',
                        type: 'hard',
                        rule: 'min_nurses_per_shift',
                        message: `Schicht ${shiftName} am ${dateKey}: Zu wenige Mitarbeiter (${employeeIds.length}/${rules.minNursesPerShift})`,
                        date: dateKey,
                        createdAt: new Date()
                    });
                }
            }
        }
        employees.forEach(emp => {
            const assigned = availability[emp.id].totalHoursAssigned;
            const target = emp.hoursPerMonth;
            const tolerance = target * rules.weeklyHoursOverflowTolerance;
            if (assigned > target + tolerance) {
                softViolations.push({
                    id: (0, uuid_1.v4)(),
                    shiftPlanId: '',
                    type: 'soft',
                    rule: 'hours_overflow',
                    message: `${emp.name}: Überstunden (${assigned}h/${target}h)`,
                    employeeId: emp.id,
                    createdAt: new Date()
                });
            }
        });
        return { hard: hardViolations, soft: softViolations };
    }
    static calculateStatistics(shiftPlan, employees, availability, year, month) {
        const daysInMonth = new Date(year, month, 0).getDate();
        let completeDays = 0;
        let incompleteDays = 0;
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month - 1, day);
            const dayKey = this.formatDateKey(date);
            if (date.getDay() === 0)
                continue;
            if (shiftPlan[dayKey] && shiftPlan[dayKey] !== null) {
                const dayPlan = shiftPlan[dayKey];
                const hasShifts = Object.values(dayPlan).some(shifts => shifts.length > 0);
                if (hasShifts) {
                    completeDays++;
                }
                else {
                    incompleteDays++;
                }
            }
            else {
                incompleteDays++;
            }
        }
        const workingDays = daysInMonth - this.countSundays(year, month);
        const completionRate = (completeDays / workingDays) * 100;
        const workloadDistribution = employees.map(emp => {
            const assigned = availability[emp.id]?.totalHoursAssigned || 0;
            const target = emp.hoursPerMonth;
            const percentage = (assigned / target) * 100;
            return {
                employeeId: emp.id,
                name: emp.name,
                assignedHours: assigned,
                targetHours: target,
                percentage
            };
        });
        const averageWorkload = workloadDistribution.reduce((sum, emp) => sum + emp.percentage, 0) / employees.length;
        const saturdayDistribution = employees.map(emp => ({
            employeeId: emp.id,
            name: emp.name,
            count: availability[emp.id]?.saturdaysWorked || 0
        }));
        return {
            completeDays,
            incompleteDays,
            completionRate,
            averageWorkload,
            workloadDistribution,
            saturdayDistribution
        };
    }
    static async saveShiftPlan(planData) {
        const id = (0, uuid_1.v4)();
        const stmt = database_1.db.prepare(`
      INSERT OR REPLACE INTO shift_plans (
        id, year, month, plan_data, employee_availability, statistics, is_finalized
      ) VALUES (?, ?, ?, ?, ?, ?, 0)
    `);
        stmt.run(id, planData.year, planData.month, JSON.stringify(planData.planData), JSON.stringify(planData.employeeAvailability), JSON.stringify(planData.statistics));
        return { id };
    }
    static async saveConstraintViolations(shiftPlanId, violations) {
        const stmt = database_1.db.prepare(`
      INSERT INTO constraint_violations (
        id, shift_plan_id, type, rule, message, employee_id, date, severity, is_resolved
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
    `);
        const insertMany = database_1.db.transaction((allViolations) => {
            for (const violation of allViolations) {
                stmt.run(violation.id, shiftPlanId, violation.type, violation.rule, violation.message, violation.employeeId || null, violation.date || null, violation.type === 'hard' ? 3 : 2);
            }
        });
        insertMany([...violations.hard, ...violations.soft]);
    }
    static formatDateKey(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }
    static countSaturdaysUpToDate(year, month, day) {
        let count = 0;
        for (let d = 1; d <= day; d++) {
            const date = new Date(year, month - 1, d);
            if (date.getDay() === 6)
                count++;
        }
        return count;
    }
    static countSundays(year, month) {
        const daysInMonth = new Date(year, month, 0).getDate();
        let count = 0;
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month - 1, day);
            if (date.getDay() === 0)
                count++;
        }
        return count;
    }
}
exports.ShiftPlanningService = ShiftPlanningService;
//# sourceMappingURL=ShiftPlanningService.js.map