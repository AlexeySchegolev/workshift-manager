import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, InjectDataSource } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { getDatabaseConfig } from './config/database.config';
import { SeederService } from './database/seeds/seeder.service';
import { EmployeesModule } from './modules/employees/employees.module';
import { LocationsModule } from './modules/locations/locations.module';
import { RolesModule } from './modules/roles/roles.module';
import { ShiftsModule } from './modules/shifts/shifts.module';
import { ShiftPlansModule } from './modules/shift-plans/shift-plans.module';
import { UsersModule } from './modules/users/users.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { EmployeeAbsencesModule } from './modules/employee-absences/employee-absences.module';
import { ShiftPlanDetailsModule } from './modules/shift-plan-details/shift-plan-details.module';
import { ShiftRolesModule } from './modules/shift-roles/shift-roles.module';
import { ShiftWeekdaysModule } from './modules/shift-weekdays/shift-weekdays.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

@Module({
  imports: [
    // Configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Database module
    TypeOrmModule.forRootAsync({
      useFactory: async () => getDatabaseConfig(),
    }),
    
    // Feature modules
    AuthModule,
    EmployeesModule,
    EmployeeAbsencesModule,
    LocationsModule,
    ShiftPlansModule,
    ShiftPlanDetailsModule,
    UsersModule,
    OrganizationsModule,
    RolesModule,
    ShiftsModule,
    ShiftRolesModule,
    ShiftWeekdaysModule,
  ],
  controllers: [],
  providers: [
    SeederService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    private readonly seederService: SeederService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async onApplicationBootstrap() {
    // Run seeding in development or if explicitly enabled
    if (process.env.NODE_ENV === 'development' || process.env.ENABLE_SEEDING === 'true') {
      // Wait for database synchronization to complete
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
      }
      
      // Small delay to ensure all tables are created
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await this.seederService.seed();
    }
  }
}