import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { getDatabaseConfig } from './config/database.config';
import { SeederService } from './database/seeds/seeder.service';
import { EmployeesModule } from './modules/employees/employees.module';
import { LocationsModule } from './modules/locations/locations.module';
import { RolesModule } from './modules/roles/roles.module';
import { ShiftsModule } from './modules/shifts/shifts.module';
import { ShiftPlansModule } from './modules/shift-plans/shift-plans.module';
import { ShiftRulesModule } from './modules/shift-rules/shift-rules.module';
import { UsersModule } from './modules/users/users.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { EmployeeAbsencesModule } from './modules/employee-absences/employee-absences.module';
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
    ShiftRulesModule,
    ShiftPlansModule,
    UsersModule,
    OrganizationsModule,
    RolesModule,
    ShiftsModule,
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
  constructor(private readonly seederService: SeederService) {}

  async onApplicationBootstrap() {
    if (process.env.NODE_ENV === 'development') {
      await this.seederService.seed();
    }
  }
}