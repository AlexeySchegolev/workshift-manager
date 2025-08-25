import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';

// Import modules
import { EmployeesModule } from './modules/employees/employees.module';
import { LocationsModule } from './modules/locations/locations.module';
// import { RolesModule } from './modules/roles/roles.module';
// import { ShiftsModule } from './modules/shifts/shifts.module';
import { ShiftPlansModule } from './modules/shift-plans/shift-plans.module';
import { ShiftRulesModule } from './modules/shift-rules/shift-rules.module';

@Module({
  imports: [
    // Configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Database module
    TypeOrmModule.forRootAsync({
      inject: [ConfigModule],
      useFactory: async () => getDatabaseConfig(),
    }),
    
    // Feature modules
    EmployeesModule,
    LocationsModule,
    ShiftRulesModule,
    ShiftPlansModule,
    // RolesModule,
    // ShiftsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}