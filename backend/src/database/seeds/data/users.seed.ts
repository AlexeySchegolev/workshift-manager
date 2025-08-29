import { UserRole, UserStatus } from '@/database/entities';

export const usersSeedData = [
  {
    email: 'admin@dialyse-praxis.de',
    firstName: 'System',
    lastName: 'Administrator',
    passwordHash: '$2b$10$rQZ8kZKjZQZ8kZKjZQZ8kOeKqGqGqGqGqGqGqGqGqGqGqGqGqGqGq', // password: admin123
    role: UserRole.SUPER_ADMIN,
    status: UserStatus.ACTIVE,
    phoneNumber: '+49 89 4400-1001',
    emailVerified: true,
    preferences: {
      language: 'de',
      timezone: 'Europe/Berlin',
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      dashboard: {
        defaultView: 'overview',
        refreshInterval: 30
      }
    },
    permissions: [
      'user.create',
      'user.read',
      'user.update',
      'user.delete',
      'organization.create',
      'organization.read',
      'organization.update',
      'organization.delete',
      'employee.create',
      'employee.read',
      'employee.update',
      'employee.delete',
      'shift.create',
      'shift.read',
      'shift.update',
      'shift.delete',
      'audit.read'
    ]
  }
];