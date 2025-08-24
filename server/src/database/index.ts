import { DatabaseManager } from './database';

// Singleton-Instanz
const dbManager = DatabaseManager.getInstance();

// Direkte Datenbankinstanz exportieren
export const db = dbManager.getDatabase();
export { dbManager };