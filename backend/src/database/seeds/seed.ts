import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { SeederService } from './seeder.service';
import { Logger } from '@nestjs/common';

async function runSeed() {
  const logger = new Logger('SeedRunner');
  
  try {
    logger.log('🌱 Starte manuelles Database Seeding...');
    
    const app = await NestFactory.createApplicationContext(AppModule);
    const seederService = app.get(SeederService);
    
    await seederService.seed();
    
    const summary = await seederService.getSeededDataSummary();
    logger.log(`📊 Seeding-Zusammenfassung:`);
    logger.log(`   • Standorte: ${summary.locations}`);
    logger.log(`   • Mitarbeiter: ${summary.employees}`);
    logger.log(`   • Schichtregeln: ${summary.shiftRules}`);
    
    await app.close();
    logger.log('✅ Manuelles Database Seeding erfolgreich abgeschlossen!');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Fehler beim manuellen Database Seeding:', error);
    process.exit(1);
  }
}

runSeed();