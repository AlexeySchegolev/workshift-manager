export declare class MigrationManager {
    private static readonly MIGRATION_TABLE;
    static init(): void;
    static runMigrations(): Promise<void>;
    private static runSchemaMigration;
    private static getAppliedMigrations;
    private static markMigrationAsApplied;
    static rollbackMigration(version: string): void;
    static showMigrationStatus(): void;
    static checkDatabaseIntegrity(): boolean;
    static createBackup(): string;
}
export declare const runMigrations: () => Promise<void>;
//# sourceMappingURL=migrations.d.ts.map