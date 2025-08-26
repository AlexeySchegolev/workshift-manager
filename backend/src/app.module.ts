import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';
import { SeederService } from './database/seeds/seeder.service';

// Import modules
import { EmployeesModule } from './modules/employees/employees.module';
import { LocationsModule } from './modules/locations/locations.module';
// import { RolesModule } from './modules/roles/roles.module';
// import { ShiftsModule } from './modules/shifts/shifts.module';
import { ShiftPlansModule } from './modules/shift-plans/shift-plans.module';
import { ShiftRulesModule } from './modules/shift-rules/shift-rules.module';
import { UsersModule } from './modules/users/users.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';

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
    EmployeesModule,
    LocationsModule,
    ShiftRulesModule,
    ShiftPlansModule,
    UsersModule,
    OrganizationsModule,
    // RolesModule,
    // ShiftsModule,
  ],
  controllers: [],
  providers: [SeederService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly seederService: SeederService) {}

  async onApplicationBootstrap() {
    if (process.env.NODE_ENV === 'development') {
      await this.seederService.seed();
    }
  }
}