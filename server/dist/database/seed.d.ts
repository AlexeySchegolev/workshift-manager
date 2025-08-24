export declare class SeedManager {
    static seedAll(): Promise<void>;
    private static seedEmployees;
    private static seedLocations;
    private static seedShiftDefinitions;
    private static seedShiftRules;
    static checkSeedStatus(): boolean;
    static clearSeedData(): void;
}
export declare const seedDatabase: () => Promise<void>;
//# sourceMappingURL=seed.d.ts.map