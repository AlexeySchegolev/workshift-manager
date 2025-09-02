import {UserRole} from "@/database/entities/user.entity";

export const usersSeedData = [
  {
    email: 'admin@dialyse-praxis.de',
    firstName: 'System',
    lastName: 'Administrator',
    passwordHash: '$2b$10$Y4MhIXpsrrS8VCHfKAsE4uW8K00loO1KoRRaiNubCFuYMbMh4.luy', // password: admin123
    role: UserRole.SUPER_ADMIN,
    isActive: true,
    phoneNumber: '+49 89 4400-1001',
    organizationId: '1' // Will be replaced with actual organization ID during seeding
  }
];