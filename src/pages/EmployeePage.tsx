import React, { useState } from 'react';
import { Box, Typography, Divider } from '@mui/material';

import EmployeeManagement from '../components/EmployeeManagement';
import { Employee } from '../models/interfaces';
import { employeeData } from '../data/employeeData';

/**
 * Mitarbeiterverwaltungs-Seite
 */
const EmployeePage: React.FC = () => {
  // Mitarbeiterliste immer direkt aus der Datei laden, nicht aus localStorage
  const [employees, setEmployees] = useState<Employee[]>(employeeData);

  // Mitarbeiter aktualisieren (aber nicht in localStorage speichern)
  const handleEmployeesChange = (updatedEmployees: Employee[]) => {
    setEmployees(updatedEmployees);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Mitarbeiterverwaltung
      </Typography>
      
      <Divider sx={{ mb: 3 }} />
      
      <EmployeeManagement 
        employees={employees} 
        onEmployeesChange={handleEmployeesChange} 
      />
    </Box>
  );
};

export default EmployeePage;