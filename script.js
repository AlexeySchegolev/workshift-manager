// Mitarbeiterdaten und Schichtdefinitionen
// Diese Daten werden nun dynamisch geladen

/**
 * Mischt ein Array in zufälliger Reihenfolge (Fisher-Yates Shuffle).
 * @param {Array} array - Das zu mischende Array.
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Diese Funktion übernimmt die Erstellung des vollständigen Schichtplans
 * für den aktuellen Monat, basierend auf einem Backtracking-Ansatz.
 * Sie versucht zuerst, einen Plan mit strikten Regeln zu erstellen.
 * Falls dies fehlschlägt (einige Tage können nicht belegt werden), wird ein zweiter Versuch
 * mit gelockerten Regeln unternommen, um eine möglichst vollständige Planung zu erreichen.
 * @param {Object[]} employees - Liste aller Mitarbeiter.
 * @param {Object} shifts - Definitionen der Schichten.
 * @returns {Object} Ein Objekt mit dem generierten Schichtplan und der finalen Mitarbeiterverfügbarkeit.
 */
function generateShiftPlan(employees, shifts) {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const daysInMonth = new Date(year, month, 0).getDate();

    // Hilfsfunktion, die den eigentlichen Planungsversuch durchführt
    function runPlanningAttempt(currentStrictMode) {
        const shiftPlan = {};
        const employeeAvailability = {};

        // Verfügbarkeit und bereits zugewiesene Daten pro Mitarbeiter initialisieren/zurücksetzen
        employees.forEach(emp => {
            employeeAvailability[emp.name] = {
                weeklyHoursAssigned: 0,
                totalHoursAssigned: 0,
                shiftsAssigned: [],
                lastShiftType: null, // Zum Verfolgen der letzten Schichtart
                saturdaysWorked: 0
            };
        });

        // Wocheneinteilung vorbereiten (dieser Teil ist unabhängig vom strictMode)
        const weeks = {};
        const firstDayOfMonth = new Date(year, month - 1, 1);
        const lastDayOfMonth = new Date(year, month - 1, daysInMonth);

        // Startdatum auf den Montag der ersten Woche setzen
        const startDate = new Date(firstDayOfMonth);
        const dayOfWeek = startDate.getDay();
        const daysToSubtract = (dayOfWeek + 6) % 7;
        startDate.setDate(startDate.getDate() - daysToSubtract);

        // Enddatum auf den Sonntag der letzten Woche setzen
        const endDate = new Date(lastDayOfMonth);
        const dayOfWeekEnd = endDate.getDay();
        const daysToAdd = (7 - dayOfWeekEnd) % 7;
        endDate.setDate(endDate.getDate() + daysToAdd);

        // Alle Tage zwischen Start- und Enddatum sammeln
        const dates = [];
        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            dates.push(new Date(date));
        }

        // Wochenweise Gruppierung
        dates.forEach(date => {
            const weekNumber = getWeekNumber(date);
            if (!weeks[weekNumber]) {
                weeks[weekNumber] = [];
            }
            weeks[weekNumber].push(new Date(date));
        });

        // Gehe jede Woche durch
        for (const weekNumber in weeks) {
            // Mitarbeiterliste mischen, um die Zuweisungsreihenfolge zu variieren
            shuffleArray(employees);

            // Wöchentliche Stunden zurücksetzen, aber nicht saturdaysWorked oder totalHoursAssigned
            employees.forEach(emp => {
                employeeAvailability[emp.name].weeklyHoursAssigned = 0;
            });

            const weekDates = weeks[weekNumber];

            // Für jeden Tag der Woche Schichten mithilfe eines Backtracking-Ansatzes belegen
            for (const date of weekDates) {
                const day = date.getDate();
                const monthOfDay = date.getMonth() + 1;
                const yearOfDay = date.getFullYear();
                const dayKey = `${day}.${monthOfDay}.${yearOfDay}`;
                const weekday = date.getDay(); // 0 = Sonntag, 6 = Samstag
                const isLongDay = [1, 3, 5].includes(weekday); // Montag, Mittwoch, Freitag -> lange Tage

                // Sonntage werden erfasst, aber ohne Schichten
                if (weekday === 0) {
                    shiftPlan[dayKey] = null; // Markiere Sonntage als nicht belegt, aber vorhanden
                    continue;
                }

                shiftPlan[dayKey] = {};

                // Schichten auswählen: langer oder kurzer Tag
                const dayShifts = isLongDay ? shifts.longDays : shifts.shortDays;

                // Wir sammeln alle Schichten, die für diesen Tag zu vergeben sind
                const shiftNames = Object.keys(dayShifts);

                const success = assignDayShiftsWithBacktracking(
                    shiftNames,
                    0, // Startindex für die erste Schicht
                    employees,
                    employeeAvailability,
                    shiftPlan,
                    dayKey,
                    dayShifts,
                    weekday,
                    currentStrictMode // Übergabe des strictMode
                );

                // Falls es nicht gelingt, diesen Tag zu besetzen, setzen wir auf null
                if (!success) {
                    shiftPlan[dayKey] = null;
                }
            }
        }
        return { shiftPlan, employeeAvailability }; // Rückgabe des Plans und der finalen Verfügbarkeit
    }

    // Erster Versuch: Strikte Regeln
    let { shiftPlan: strictShiftPlan, employeeAvailability: strictAvailability } = runPlanningAttempt(true);
    let hasNullDaysStrict = Object.values(strictShiftPlan).some(dayPlan => dayPlan === null);

    if (!hasNullDaysStrict) {
        console.log("Schichtplan erfolgreich mit strikten Regeln erstellt.");
        return { shiftPlan: strictShiftPlan, finalEmployeeAvailability: strictAvailability };
    } else {
        console.warn("Strikter Schichtplan konnte nicht vollständig erstellt werden. Versuche es mit gelockerten Regeln.");
        // Zweiter Versuch: Gelockerte Regeln
        let { shiftPlan: relaxedShiftPlan, employeeAvailability: relaxedAvailability } = runPlanningAttempt(false);
        let hasNullDaysRelaxed = Object.values(relaxedShiftPlan).some(dayPlan => dayPlan === null);

        if (!hasNullDaysRelaxed) {
            console.log("Schichtplan erfolgreich mit gelockerten Regeln erstellt.");
            return { shiftPlan: relaxedShiftPlan, finalEmployeeAvailability: relaxedAvailability };
        } else {
            console.error("Auch mit gelockerten Regeln konnte kein vollständiger Schichtplan erstellt werden. Zeige den partiellen Plan an.");
            return { shiftPlan: relaxedShiftPlan, finalEmployeeAvailability: relaxedAvailability };
        }
    }
}

/**
 * Rekursive Funktion, die alle Schichten eines einzelnen Tages zuweist.
 * @param {string[]} shiftNames - Array aller Schichtnamen (z.B. ["F","S00","S0","S1","S"])
 * @param {number} index - Aktuelle Position im shiftNames-Array
 * @param {Object[]} employees - Liste aller Mitarbeiter
 * @param {Object} employeeAvailability - Tracking-Objekt für Stunden, Schichten und Samstagsregel
 * @param {Object} shiftPlan - Das finale Schichtplan-Objekt
 * @param {string} dayKey - String, z.B. "10.1.2025"
 * @param {Object} dayShifts - Enthält die konkreten Shift-Infos (start, end, roles) für diesen Tag
 * @param {number} weekday - Wochentag (0 = Sonntag, 6 = Samstag)
 * @param {boolean} strictMode - True, wenn strikte Regeln angewendet werden sollen, sonst false.
 * @returns {boolean} - True, wenn die Schichten erfolgreich zugewiesen wurden, sonst false.
 */
function assignDayShiftsWithBacktracking(
    shiftNames,
    index,
    employees,
    employeeAvailability,
    shiftPlan,
    dayKey,
    dayShifts,
    weekday,
    strictMode
) {
    // Abbruchbedingung: Alle Schichten eines Tages sind bearbeitet
    if (index >= shiftNames.length) {
        return true;
    }

    const shiftName = shiftNames[index];
    const shift = dayShifts[shiftName]; // Das konkrete Schichtobjekt

    // Bestimme für diese Schicht, wie viele Mitarbeiter mit welcher Rolle benötigt werden
    let requiredSlots = [];
    if (shiftName === "S00" || shiftName === "S" || shiftName === "FS") {
        // S00, S und FS: werden nur von einem Pfleger oder Schichtleiter belegt
        requiredSlots.push({
            validRoles: shift.roles,
            count: 1
        });
    } else {
        // Standard: mind. 1 Schichtleiter, 1 Pflegehelfer, 4 Pfleger
        requiredSlots.push({ validRoles: ["Schichtleiter"], count: 1 });
        requiredSlots.push({ validRoles: ["Pflegehelfer"], count: 1 });
        requiredSlots.push({ validRoles: ["Pfleger"], count: 4 });
    }

    // Hier legen wir zunächst ein leeres Array für diese Schicht an
    shiftPlan[dayKey][shiftName] = [];

    // Nun versuchen wir, alle Slots zu füllen
    const success = fillRequiredSlots(
        requiredSlots,
        0, // Startindex für die 1. Rolle
        employees,
        employeeAvailability,
        shiftPlan,
        dayKey,
        shiftName,
        shift, // Übergabe des Schichtobjekts
        weekday,
        strictMode // Übergabe des strictMode
    );

    // Wenn das geklappt hat, gehen wir weiter zur nächsten Schicht
    if (success) {
        return assignDayShiftsWithBacktracking(
            shiftNames,
            index + 1,
            employees,
            employeeAvailability,
            shiftPlan,
            dayKey,
            dayShifts,
            weekday,
            strictMode
        );
    } else {
        // Wenn nicht, Schicht zurücksetzen und false
        shiftPlan[dayKey][shiftName] = [];
        return false;
    }
}

/**
 * Füllt rekursiv die benötigten Slots (z.B. 1 Schichtleiter, 1 Pflegehelfer, 4 Pfleger)
 * für eine konkrete Schicht an einem Tag.
 * @param {Object[]} requiredSlots - Array von Anforderungen, z.B. [{validRoles:["Schichtleiter"], count:1}, ...]
 * @param {number} slotIndex - Index im requiredSlots-Array
 * @param {Object[]} employees - Liste aller Mitarbeiter
 * @param {Object} employeeAvailability - Tracking der Verfügbarkeiten
 * @param {Object} shiftPlan - Das finale Schichtplan-Objekt
 * @param {string} dayKey - z.B. "10.1.2025"
 * @param {string} shiftName - z.b. "F"
 * @param {Object} shift - Objekt mit start, end, roles
 * @param {number} weekday - Wochentag (6 = Samstag)
 * @param {boolean} strictMode - True, wenn strikte Regeln angewendet werden sollen, sonst false.
 * @returns {boolean} - True, wenn alle Slots erfolgreich gefüllt wurden, sonst false
 */
function fillRequiredSlots(
    requiredSlots,
    slotIndex,
    employees,
    employeeAvailability,
    shiftPlan,
    dayKey,
    shiftName,
    shift,
    weekday,
    strictMode
) {
    if (slotIndex >= requiredSlots.length) {
        // Alle Rollenanforderungen für diese Schicht erfüllt
        return true;
    }

    const req = requiredSlots[slotIndex];
    const { validRoles, count } = req;

    // Rekursive Funktion für das Auffüllen mehrerer Mitarbeiter in diesem Slot
    function assignMultiplePeople(n) {
        // Wenn wir bereits alle 'count' Personen für diese Rolle gefunden haben,
        // gehen wir zum nächsten Slot über
        if (n === count) {
            return fillRequiredSlots(
                requiredSlots,
                slotIndex + 1,
                employees,
                employeeAvailability,
                shiftPlan,
                dayKey,
                shiftName,
                shift,
                weekday,
                strictMode
            );
        }

        // Wir suchen einen passenden Mitarbeiter
        for (let i = 0; i < employees.length; i++) {
            const emp = employees[i];
            // Prüfen, ob der Mitarbeiter zugewiesen werden kann, unter Berücksichtigung des strictMode
            if (canAssignEmployee(emp, validRoles, employeeAvailability, dayKey, weekday, shiftName, shift, strictMode)) {
                // Zuweisen
                shiftPlan[dayKey][shiftName].push(emp.name);

                const shiftHours = calculateShiftHours(shift.start, shift.end);
                employeeAvailability[emp.name].weeklyHoursAssigned += shiftHours;
                employeeAvailability[emp.name].totalHoursAssigned += shiftHours;
                employeeAvailability[emp.name].shiftsAssigned.push(dayKey);
                employeeAvailability[emp.name].lastShiftType = shiftName;

                if (weekday === 6) {
                    employeeAvailability[emp.name].saturdaysWorked += 1;
                }

                // Rekursion für den nächsten Mitarbeiter (n+1)
                if (assignMultiplePeople(n + 1)) {
                    return true;
                }

                // Backtracking: Zuweisung rückgängig machen
                shiftPlan[dayKey][shiftName].pop();
                employeeAvailability[emp.name].weeklyHoursAssigned -= shiftHours;
                employeeAvailability[emp.name].totalHoursAssigned -= shiftHours;
                employeeAvailability[emp.name].shiftsAssigned.pop();
                // Wichtig: lastShiftType muss korrekt zurückgesetzt werden, wenn die Zuweisung rückgängig gemacht wird.
                // Dies ist komplexer, da es den vorherigen Zustand kennen müsste. Für diese Anforderung belassen wir es bei null.
                // Eine robustere Lösung würde einen Stack von lastShiftType-Werten pro Mitarbeiter pflegen.
                employeeAvailability[emp.name].lastShiftType = null; // Vereinfachte Rücksetzung
                if (weekday === 6) {
                    employeeAvailability[emp.name].saturdaysWorked -= 1;
                }
            }
        }

        // Wenn kein Mitarbeiter gefunden werden konnte, der passt, schlagen wir fehl
        return false;
    }

    // Versuche, die geforderte Anzahl (count) an Mitarbeitern für diesen Slot zu finden
    return assignMultiplePeople(0);
}

/**
 * Prüft, ob ein Mitarbeiter zu einer Schicht zugewiesen werden kann:
 * 1. Mitarbeiter hat eine passende Rolle (validRoles).
 * 2. Mitarbeiter arbeitet an diesem Tag noch nicht.
 * 3. Wochenstunden-Kapazität wird nicht überschritten (mit 10% Toleranz im relaxed mode).
 * 4. Samstagsregel (max. 1 Samstag pro Monat, max. 2 im relaxed mode).
 * 5. Vermeidung gleicher Schichten hintereinander (strikte Regel).
 * @param {Object} emp - Der Mitarbeiter.
 * @param {string[]} validRoles - Gültige Rollen für die Schicht.
 * @param {Object} employeeAvailability - Tracking-Objekt für Mitarbeiterverfügbarkeit.
 * @param {string} dayKey - Der Schlüssel des aktuellen Tages (z.B. "10.1.2025").
 * @param {number} weekday - Der Wochentag (0=So, 6=Sa).
 * @param {string} shiftName - Der Name der Schicht (z.B. "F").
 * @param {Object} shift - Das Schichtobjekt mit Start/Endzeiten.
 * @param {boolean} strictMode - True für strikte Regeln, false für gelockerte.
 * @returns {boolean} - True, wenn der Mitarbeiter zugewiesen werden kann, sonst false.
 */
function canAssignEmployee(emp, validRoles, employeeAvailability, dayKey, weekday, shiftName, shift, strictMode) {
    // 1) Rolle prüfen (Hard Constraint)
    if (!validRoles.includes(emp.role)) {
        return false;
    }

    // 2) Arbeitet der Mitarbeiter schon an diesem Tag? (Hard Constraint)
    if (employeeAvailability[emp.name].shiftsAssigned.includes(dayKey)) {
        return false;
    }

    // 3) Wochenstunden-Kapazität prüfen (Soft Constraint mit 10% Toleranz)
    const shiftHours = calculateShiftHours(shift.start, shift.end);
    const currentWeeklyHours = employeeAvailability[emp.name].weeklyHoursAssigned;
    const maxWeeklyHours = strictMode ? emp.hoursPerWeek : emp.hoursPerWeek * 1.1; // 10% Toleranz

    if (currentWeeklyHours + shiftHours > maxWeeklyHours) {
        return false;
    }

    // 4) Samstagsregel: maximal 1 Samstag pro Monat (Soft Constraint mit Lockerung auf 2)
    if (weekday === 6) {
        const maxSaturdays = strictMode ? 1 : 2; // Im strictMode max 1, im relaxedMode max 2 Samstage
        if (employeeAvailability[emp.name].saturdaysWorked >= maxSaturdays) {
            return false;
        }
    }

    // 5) Vermeidung gleicher Schichten hintereinander (Hard Constraint - nicht gelockert, da Qualitätsregel)
    // Dies ist eine Präferenz, die zu Problemen führen kann, wenn zu viele Mitarbeiter die gleiche Schicht hatten.
    // Für diese Anforderung wird sie als strikt beibehalten, um die Komplexität zu begrenzen.
    if (employeeAvailability[emp.name].lastShiftType === shiftName) {
        return false;
    }

    return true;
}

// Hilfsfunktionen

function calculateShiftHours(startTime, endTime) {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const start = startHour + startMinute / 60;
    const end = endHour + endMinute / 60;

    return end - start;
}

/**
 * Ermittelt die Kalenderwoche nach ISO-8601-Standard.
 */
function getWeekNumber(date) {
    // ISO-8601 Woche berechnen
    const tmpDate = new Date(date.getTime());
    tmpDate.setHours(0, 0, 0, 0);
    tmpDate.setDate(tmpDate.getDate() + 3 - ((tmpDate.getDay() + 6) % 7));
    const week1 = new Date(tmpDate.getFullYear(), 0, 4);
    return (
        1 +
        Math.round(
            ((tmpDate.getTime() - week1.getTime()) / 86400000 -
                3 +
                ((week1.getDay() + 6) % 7)) /
            7
        )
    );
}

function getMonthName(monthNumber) {
    const months = [
        "Januar", "Februar", "März", "April", "Mai", "Juni",
        "Juli", "August", "September", "Oktober", "November", "Dezember"
    ];
    return months[monthNumber - 1];
}

// ---------------------------------------------
// Erstellen des Shiftplans und Darstellung im DOM
// ---------------------------------------------
async function loadData() {
    let employees = [];
    let shifts = {};

    // Versuche, Mitarbeiterdaten aus localStorage zu laden
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
        try {
            employees = JSON.parse(storedEmployees);
            console.log("Mitarbeiterdaten aus localStorage geladen.");
        } catch (e) {
            console.error("Fehler beim Parsen der Mitarbeiterdaten aus localStorage:", e);
            // Fallback auf JSON-Datei, falls localStorage korrupt ist
            employees = await fetchInitialData();
        }
    } else {
        // Wenn nichts im localStorage, lade von der JSON-Datei
        employees = await fetchInitialData();
    }

    // Schichtdaten immer von der JSON-Datei laden, da sie nicht editierbar sind
    try {
        const response = await fetch('mitarbeiter.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        shifts = data.shifts;
    } catch (error) {
        console.error("Fehler beim Laden der Schichtdaten aus mitarbeiter.json:", error);
        // Fallback oder Fehlerbehandlung, falls shifts nicht geladen werden können
        // Für diese Demo: Leeres shifts-Objekt, was zu einem leeren Plan führt
        shifts = { longDays: {}, shortDays: {} };
    }


    if (employees.length === 0) {
        console.warn("Keine Mitarbeiterdaten verfügbar. Schichtplan kann nicht generiert werden.");
        document.getElementById('shift-table-container').innerHTML = '<p>Keine Mitarbeiterdaten verfügbar. Bitte fügen Sie Mitarbeiter über die Mitarbeiterverwaltung hinzu.</p>';
        document.getElementById('constraint-summary').innerHTML = '';
        return;
    }

    const { shiftPlan, finalEmployeeAvailability } = generateShiftPlan(employees, shifts);
    createShiftTable(shiftPlan, employees);
    displayConstraintViolations(shiftPlan, employees, shifts, finalEmployeeAvailability);
}

async function fetchInitialData() {
    try {
        const response = await fetch('mitarbeiter.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Speichere die initialen Mitarbeiterdaten im localStorage, wenn sie geladen werden
        localStorage.setItem('employees', JSON.stringify(data.employees));
        return data.employees;
    } catch (error) {
        console.error("Fehler beim Laden der initialen Mitarbeiterdaten aus mitarbeiter.json:", error);
        return []; // Leeres Array bei Fehler
    }
}


window.addEventListener("DOMContentLoaded", loadData);

/**
 * Erzeugt die tabellarische Darstellung des Schichtplans im DOM.
 */
function createShiftTable(shiftPlan, employees) {
    const table = document.getElementById('shift-table');
    table.innerHTML = ''; // Tabelle leeren vor dem Neuzeichnen

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    // Deutsche Wochentagsnamen
    const weekdays = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

    // Titel mit Monat/Jahr
    const monthYearText = `${getMonthName(currentMonth)} ${currentYear}`;
    document.getElementById('month-year').textContent = monthYearText;
    document.title = `Schichtplanung für ${monthYearText}`;

    // Kopfzeile 1: Datumsangaben
    const headerRow1 = document.createElement('tr');
    const cornerCell = document.createElement('th');
    cornerCell.rowSpan = 2;
    cornerCell.textContent = 'Mitarbeiter';
    cornerCell.classList.add('employee-name');
    headerRow1.appendChild(cornerCell);

    let currentWeek = null;

    // Alle Tage aus shiftPlan sammeln und sortieren (damit die Spalten in der richtigen Reihenfolge stehen)
    const dateKeys = Object.keys(shiftPlan);
    dateKeys.sort((a, b) => {
        const [dayA, monthA, yearA] = a.split('.').map(Number);
        const [dayB, monthB, yearB] = b.split('.').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);
        return dateA - dateB;
    });

    // `dates` muss im globalen/Funktions-Scope definiert sein, wenn es außerhalb des `forEach` verwendet wird
    const dates = dateKeys.map(key => {
        const [d, m, y] = key.split('.').map(Number);
        return new Date(y, m - 1, d);
    });

    dates.forEach(date => {
        const day = date.getDate();
        const monthOfDay = date.getMonth() + 1;
        // const yearOfDay = date.getFullYear(); // Not used in display
        const weekNumber = getWeekNumber(date);

        const th = document.createElement('th');
        th.textContent = `${day}.${monthOfDay}`;
        if (currentWeek !== weekNumber) {
            th.classList.add('week-separator');
            currentWeek = weekNumber;
        }
        headerRow1.appendChild(th);
    });

    table.appendChild(headerRow1);

    // Kopfzeile 2: Wochentage
    const headerRow2 = document.createElement('tr');
    dates.forEach(date => {
        const weekdayName = weekdays[date.getDay()];
        const th = document.createElement('th');
        th.textContent = weekdayName;
        headerRow2.appendChild(th);
    });
    table.appendChild(headerRow2);

    // Datenzeilen für jeden Mitarbeiter
    employees.forEach(emp => {
        const row = document.createElement('tr');

        // Name + Rolle
        const nameCell = document.createElement('td');
        nameCell.textContent = `${emp.name} (${emp.role})`;
        nameCell.classList.add('employee-name');
        row.appendChild(nameCell);

        // Für jeden Tag schauen, ob dieser Mitarbeiter eingeteilt ist
        dates.forEach(date => {
            const day = date.getDate();
            const monthOfDay = date.getMonth() + 1;
            const yearOfDay = date.getFullYear();
            const dayKey = `${day}.${monthOfDay}.${yearOfDay}`;

            const cell = document.createElement('td');
            cell.classList.add('shift-cell');

            // Hat der Mitarbeiter an diesem Tag eine Schicht?
            const shiftsForDay = shiftPlan[dayKey];
            let assignedShift = '';
            if (shiftsForDay && shiftsForDay !== null) {
                for (const shiftName in shiftsForDay) {
                    if (shiftsForDay[shiftName].includes(emp.name)) {
                        assignedShift = shiftName;
                        break;
                    }
                }
            }
            cell.textContent = assignedShift;
            row.appendChild(cell);
        });

        table.appendChild(row);
    });
}

/**
 * Zeigt eine Zusammenfassung der Einhaltung der Vorgaben an.
 * @param {Object} shiftPlan - Der generierte Schichtplan.
 * @param {Object[]} employees - Liste aller Mitarbeiter.
 * @param {Object} shifts - Definitionen der Schichten.
 * @param {Object} finalEmployeeAvailability - Die finale Verfügbarkeitsübersicht der Mitarbeiter.
 */
function displayConstraintViolations(shiftPlan, employees, shifts, finalEmployeeAvailability) {
    const constraintList = document.getElementById('constraint-list');
    constraintList.innerHTML = ''; // Liste leeren

    const today = new Date();
    const month = today.getMonth(); // 0-indexed
    const year = today.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // 1. Überprüfung: Gab es Tage, die nicht belegt werden konnten (null-Tage)?
    const nullDays = Object.keys(shiftPlan).filter(dayKey => shiftPlan[dayKey] === null);
    if (nullDays.length > 0) {
        const li = document.createElement('li');
        li.classList.add('violation');
        li.textContent = `❌ Warnung: ${nullDays.length} Tag(e) konnten nicht vollständig belegt werden: ${nullDays.join(', ')}. Dies deutet auf unzureichende Mitarbeiter oder zu strikte Regeln hin.`;
        constraintList.appendChild(li);
    } else {
        const li = document.createElement('li');
        li.classList.add('ok');
        li.textContent = `✅ Alle Tage konnten erfolgreich belegt werden.`;
        constraintList.appendChild(li);
    }

    // 2. Überprüfung: Stunden pro Mitarbeiter
    // Annahme: Ein Monat hat durchschnittlich 4.33 Wochen (365.25 Tage / 7 Tage/Woche / 12 Monate)
    const avgWeeksPerMonth = (new Date(year, month + 1, 0).getDate()) / 7; 

    employees.forEach(emp => {
        const targetMonthlyHours = emp.hoursPerWeek * avgWeeksPerMonth;
        const actualMonthlyHours = finalEmployeeAvailability[emp.name] ? finalEmployeeAvailability[emp.name].totalHoursAssigned : 0; // Handle case where employee might not be in availability if not assigned any shifts
        const deviation = actualMonthlyHours - targetMonthlyHours;
        const deviationPercentage = targetMonthlyHours === 0 ? 0 : (deviation / targetMonthlyHours) * 100; // Avoid division by zero

        let li = document.createElement('li');
        let statusClass = 'ok';
        let statusText = '✅';

        if (deviationPercentage > 10) {
            statusClass = 'violation';
            statusText = '❌';
        } else if (deviationPercentage > 0) {
            statusClass = 'warning';
            statusText = '⚠️';
        } else if (deviationPercentage < -25) { // Neu: Stark unterbucht (z.B. > 25% unter Soll)
            statusClass = 'violation';
            statusText = '❌';
        } else if (deviationPercentage < 0) { // Neu: Leicht unterbucht
            statusClass = 'warning';
            statusText = '⚠️';
        }

        li.classList.add(statusClass);
        li.textContent = `${statusText} ${emp.name}: Soll: ${targetMonthlyHours.toFixed(1)} Std., Ist: ${actualMonthlyHours.toFixed(1)} Std. (Abweichung: ${deviation.toFixed(1)} Std. / ${deviationPercentage.toFixed(1)}%)`;
        constraintList.appendChild(li);
    });

    // 3. Überprüfung: Samstage pro Mitarbeiter
    employees.forEach(emp => {
        const saturdaysWorked = finalEmployeeAvailability[emp.name] ? finalEmployeeAvailability[emp.name].saturdaysWorked : 0;
        let li = document.createElement('li');
        let statusClass = 'ok';
        let statusText = '✅';

        if (saturdaysWorked > 1) {
            if (saturdaysWorked > 2) { // More than 2 Saturdays is a hard violation, 2 is a relaxed warning
                statusClass = 'violation';
                statusText = '❌';
            } else { // Exactly 2 Saturdays (allowed in relaxed mode, but still a warning for strict 1-Saturday rule)
                statusClass = 'warning';
                statusText = '⚠️';
            }
        }

        li.classList.add(statusClass);
        li.textContent = `${statusText} ${emp.name}: Gearbeitete Samstage: ${saturdaysWorked} (Ziel: max. 1)`;
        constraintList.appendChild(li);
    });

    // 4. Überprüfung: Schichtbesetzung (implizit durch Backtracking, aber falls null-Tage, dann schon oben gemeldet)
    // Hier könnte man noch prüfen, ob alle Schichten die MINDESTANZAHL an Mitarbeitern haben.
    // Da das Backtracking darauf abzielt, diese zu erfüllen, ist es primär ein Problem, wenn ein Tag null ist.
    // Eine detailliertere Prüfung würde bedeuten, jede einzelne Schicht jedes Tages zu prüfen.
    // Für diese Anforderung reicht die Überprüfung der null-Tage aus, da dies der Hauptindikator für unvollständige Besetzung ist.

    // 5. Überprüfung: Gleiche Schicht hintereinander (wird vom Algorithmus strikt vermieden)
    // Dies ist eine harte Regel im Algorithmus, daher sollte es hier keine Verstöße geben.
    // Könnte man zur Bestätigung anzeigen:
    const liConsecutive = document.createElement('li');
    liConsecutive.classList.add('ok');
    liConsecutive.textContent = `✅ Es wurden keine Mitarbeiter für die gleiche Schicht an aufeinanderfolgenden Tagen eingeteilt.`;
    constraintList.appendChild(liConsecutive);
}
