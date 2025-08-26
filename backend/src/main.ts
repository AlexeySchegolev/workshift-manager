import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import * as morgan from 'morgan';
import { AppModule } from './app.module';

// Import DTOs for extraModels
import { CreateEmployeeDto } from './modules/employees/dto/create-employee.dto';
import { UpdateEmployeeDto } from './modules/employees/dto/update-employee.dto';
import { EmployeeResponseDto } from './modules/employees/dto/employee-response.dto';
import { CreateLocationDto } from './modules/locations/dto/create-location.dto';
import { UpdateLocationDto } from './modules/locations/dto/update-location.dto';
import { LocationResponseDto } from './modules/locations/dto/location-response.dto';
import { CreateShiftPlanDto } from './modules/shift-plans/dto/create-shift-plan.dto';
import { UpdateShiftPlanDto } from './modules/shift-plans/dto/update-shift-plan.dto';
import { ShiftPlanResponseDto } from './modules/shift-plans/dto/shift-plan-response.dto';
import { CreateShiftRulesDto } from './modules/shift-rules/dto/create-shift-rules.dto';
import { UpdateShiftRulesDto } from './modules/shift-rules/dto/update-shift-rules.dto';
import { ShiftRulesResponseDto } from './modules/shift-rules/dto/shift-rules-response.dto';
import { CreateUserDto } from './modules/users/dto/create-user.dto';
import { UpdateUserDto } from './modules/users/dto/update-user.dto';
import { UserResponseDto } from './modules/users/dto/user-response.dto';
import { CreateOrganizationDto } from './modules/organizations/dto/create-organization.dto';
import { UpdateOrganizationDto } from './modules/organizations/dto/update-organization.dto';
import { OrganizationResponseDto } from './modules/organizations/dto/organization-response.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Security & Middleware
  app.use(helmet());
  app.use(compression());
  app.use(morgan('combined'));
  
  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });
  
  // Global pipes
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Workshift Manager API')
    .setDescription('API for workshift management system')
    .setVersion('1.0')
    .build();
  
  const options = {
    extraModels: [
      // Employee DTOs
      CreateEmployeeDto,
      UpdateEmployeeDto,
      EmployeeResponseDto,
      // Location DTOs
      CreateLocationDto,
      UpdateLocationDto,
      LocationResponseDto,
      // Shift Plan DTOs
      CreateShiftPlanDto,
      UpdateShiftPlanDto,
      ShiftPlanResponseDto,
      // Shift Rules DTOs
      CreateShiftRulesDto,
      UpdateShiftRulesDto,
      ShiftRulesResponseDto,
      // User DTOs
      CreateUserDto,
      UpdateUserDto,
      UserResponseDto,
      // Organization DTOs
      CreateOrganizationDto,
      UpdateOrganizationDto,
      OrganizationResponseDto,
    ]
  };
  
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api/docs', app, document);
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📖 Swagger documentation available at: http://localhost:${port}/api/docs`);
}

bootstrap();