import { RoleDefinition, RolePermission, RoleRequirement, DEFAULT_ROLES } from '../models/interfaces';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service für die Verwaltung von Rollen
 */
export class RoleManagementService {
  private static readonly STORAGE_KEY = 'shiftcare_roles';
  private static readonly PERMISSIONS_KEY = 'shiftcare_permissions';
  private static readonly REQUIREMENTS_KEY = 'shiftcare_requirements';

  /**
   * Alle verfügbaren Rollen laden
   */
  static getRoles(): RoleDefinition[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const roles = JSON.parse(stored);
        // Datum-Strings zurück zu Date-Objekten konvertieren
        return roles.map((role: any) => ({
          ...role,
          createdAt: new Date(role.createdAt),
          updatedAt: new Date(role.updatedAt)
        }));
      }
      
      // Fallback auf Standard-Rollen
      this.initializeDefaultRoles();
      return DEFAULT_ROLES;
    } catch (error) {
      console.error('Fehler beim Laden der Rollen:', error);
      return DEFAULT_ROLES;
    }
  }

  /**
   * Aktive Rollen laden (nur die, die isActive = true haben)
   */
  static getActiveRoles(): RoleDefinition[] {
    return this.getRoles().filter(role => role.isActive);
  }

  /**
   * Rolle nach ID finden
   */
  static getRoleById(id: string): RoleDefinition | undefined {
    return this.getRoles().find(role => role.id === id);
  }

  /**
   * Rolle nach Name finden
   */
  static getRoleByName(name: string): RoleDefinition | undefined {
    return this.getRoles().find(role => role.name === name);
  }

  /**
   * Neue Rolle erstellen
   */
  static createRole(roleData: Omit<RoleDefinition, 'id' | 'createdAt' | 'updatedAt'>): RoleDefinition {
    const newRole: RoleDefinition = {
      ...roleData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const roles = this.getRoles();
    roles.push(newRole);
    this.saveRoles(roles);

    return newRole;
  }

  /**
   * Rolle aktualisieren
   */
  static updateRole(id: string, updates: Partial<Omit<RoleDefinition, 'id' | 'createdAt'>>): RoleDefinition | null {
    const roles = this.getRoles();
    const roleIndex = roles.findIndex(role => role.id === id);

    if (roleIndex === -1) {
      return null;
    }

    const updatedRole: RoleDefinition = {
      ...roles[roleIndex],
      ...updates,
      updatedAt: new Date()
    };

    roles[roleIndex] = updatedRole;
    this.saveRoles(roles);

    return updatedRole;
  }

  /**
   * Rolle löschen
   */
  static deleteRole(id: string): boolean {
    const roles = this.getRoles();
    const filteredRoles = roles.filter(role => role.id !== id);

    if (filteredRoles.length === roles.length) {
      return false; // Rolle nicht gefunden
    }

    this.saveRoles(filteredRoles);
    return true;
  }

  /**
   * Rolle deaktivieren (statt löschen)
   */
  static deactivateRole(id: string): boolean {
    const updatedRole = this.updateRole(id, { isActive: false });
    return updatedRole !== null;
  }

  /**
   * Rolle aktivieren
   */
  static activateRole(id: string): boolean {
    const updatedRole = this.updateRole(id, { isActive: true });
    return updatedRole !== null;
  }

  /**
   * Rollen nach Priorität sortiert zurückgeben
   */
  static getRolesSortedByPriority(): RoleDefinition[] {
    return this.getRoles().sort((a, b) => a.priority - b.priority);
  }

  /**
   * Verfügbare Berechtigungen laden
   */
  static getPermissions(): RolePermission[] {
    try {
      const stored = localStorage.getItem(this.PERMISSIONS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      
      // Standard-Berechtigungen initialisieren
      const defaultPermissions = this.getDefaultPermissions();
      this.savePermissions(defaultPermissions);
      return defaultPermissions;
    } catch (error) {
      console.error('Fehler beim Laden der Berechtigungen:', error);
      return this.getDefaultPermissions();
    }
  }

  /**
   * Verfügbare Anforderungen laden
   */
  static getRequirements(): RoleRequirement[] {
    try {
      const stored = localStorage.getItem(this.REQUIREMENTS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      
      // Standard-Anforderungen initialisieren
      const defaultRequirements = this.getDefaultRequirements();
      this.saveRequirements(defaultRequirements);
      return defaultRequirements;
    } catch (error) {
      console.error('Fehler beim Laden der Anforderungen:', error);
      return this.getDefaultRequirements();
    }
  }

  /**
   * Rollen in localStorage speichern
   */
  private static saveRoles(roles: RoleDefinition[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(roles));
    } catch (error) {
      console.error('Fehler beim Speichern der Rollen:', error);
    }
  }

  /**
   * Berechtigungen in localStorage speichern
   */
  private static savePermissions(permissions: RolePermission[]): void {
    try {
      localStorage.setItem(this.PERMISSIONS_KEY, JSON.stringify(permissions));
    } catch (error) {
      console.error('Fehler beim Speichern der Berechtigungen:', error);
    }
  }

  /**
   * Anforderungen in localStorage speichern
   */
  private static saveRequirements(requirements: RoleRequirement[]): void {
    try {
      localStorage.setItem(this.REQUIREMENTS_KEY, JSON.stringify(requirements));
    } catch (error) {
      console.error('Fehler beim Speichern der Anforderungen:', error);
    }
  }

  /**
   * Standard-Rollen initialisieren
   */
  private static initializeDefaultRoles(): void {
    this.saveRoles(DEFAULT_ROLES);
  }

  /**
   * Standard-Berechtigungen definieren
   */
  private static getDefaultPermissions(): RolePermission[] {
    return [
      {
        id: 'view_shifts',
        name: 'Schichten anzeigen',
        description: 'Kann Schichtpläne einsehen',
        category: 'shift_planning'
      },
      {
        id: 'edit_shifts',
        name: 'Schichten bearbeiten',
        description: 'Kann Schichtpläne erstellen und bearbeiten',
        category: 'shift_planning'
      },
      {
        id: 'manage_employees',
        name: 'Mitarbeiter verwalten',
        description: 'Kann Mitarbeiterdaten verwalten',
        category: 'management'
      },
      {
        id: 'manage_roles',
        name: 'Rollen verwalten',
        description: 'Kann Rollen und Berechtigungen verwalten',
        category: 'administration'
      },
      {
        id: 'view_reports',
        name: 'Berichte anzeigen',
        description: 'Kann Berichte und Statistiken einsehen',
        category: 'reporting'
      },
      {
        id: 'manage_locations',
        name: 'Standorte verwalten',
        description: 'Kann Standorte und Praxen verwalten',
        category: 'management'
      }
    ];
  }

  /**
   * Standard-Anforderungen definieren
   */
  private static getDefaultRequirements(): RoleRequirement[] {
    return [
      {
        id: 'nursing_certification',
        type: 'certification',
        name: 'Pflegeausbildung',
        description: 'Abgeschlossene Ausbildung in der Gesundheits- und Krankenpflege',
        required: true
      },
      {
        id: 'dialysis_training',
        type: 'training',
        name: 'Dialyse-Schulung',
        description: 'Spezielle Schulung für Dialyseverfahren',
        required: true
      },
      {
        id: 'leadership_experience',
        type: 'experience',
        name: 'Führungserfahrung',
        description: 'Mindestens 2 Jahre Erfahrung in leitender Position',
        required: false
      },
      {
        id: 'first_aid',
        type: 'certification',
        name: 'Erste Hilfe',
        description: 'Gültiger Erste-Hilfe-Schein',
        required: true
      }
    ];
  }

  /**
   * Alle Daten zurücksetzen (für Entwicklung/Testing)
   */
  static resetToDefaults(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.PERMISSIONS_KEY);
    localStorage.removeItem(this.REQUIREMENTS_KEY);
    this.initializeDefaultRoles();
  }

  /**
   * Prüfen ob eine Rolle verwendet wird (von Mitarbeitern)
   */
  static isRoleInUse(roleName: string): boolean {
    // Hier würde normalerweise eine Abfrage an die Mitarbeiterdatenbank erfolgen
    // Für jetzt verwenden wir eine einfache Implementierung
    try {
      const employeeData = localStorage.getItem('employees');
      if (employeeData) {
        const employees = JSON.parse(employeeData);
        return employees.some((emp: any) => emp.role === roleName);
      }
    } catch (error) {
      console.error('Fehler beim Prüfen der Rollenverwendung:', error);
    }
    return false;
  }
}