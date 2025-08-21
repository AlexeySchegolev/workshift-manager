import React from 'react';
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Typography,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Chip
} from '@mui/material';
import { FileDownload as FileDownloadIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

import { 
  Employee, 
  MonthlyShiftPlan, 
  DayShiftPlan, 
  ConstraintCheck,
  ConstraintStatus
} from '../models/interfaces';
import { ExcelExportService } from '../services/ExcelExportService';

interface ShiftTableProps {
  employees: Employee[];
  selectedDate: Date;
  shiftPlan: MonthlyShiftPlan | null;
  constraints: ConstraintCheck[];
  isLoading: boolean;
  onGeneratePlan: () => void;
}

/**
 * Komponente zur Anzeige des Schichtplans
 */
const ShiftTable: React.FC<ShiftTableProps> = ({
  employees,
  selectedDate,
  shiftPlan,
  constraints,
  isLoading,
  onGeneratePlan
}) => {
  // Sortierte Tage des Monats aus dem Schichtplan
  const sortedDays = shiftPlan
    ? Object.keys(shiftPlan)
        // Alle Tage einbeziehen, auch die ohne Plan (null)
        .sort((a, b) => {
          const [dayA, monthA, yearA] = a.split('.').map(Number);
          const [dayB, monthB, yearB] = b.split('.').map(Number);
          const dateA = new Date(yearA, monthA - 1, dayA);
          const dateB = new Date(yearB, monthB - 1, dayB);
          return dateA.getTime() - dateB.getTime();
        })
    : [];

  // Formatierter Monatsname
  const monthName = format(selectedDate, 'MMMM yyyy', { locale: de });
  
  // Funktion zum Exportieren des Schichtplans
  const handleExportToExcel = async () => {
    if (!shiftPlan) return;
    
    try {
      const blob = await ExcelExportService.exportShiftPlan(
        shiftPlan,
        employees,
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1
      );
      
      ExcelExportService.saveExcelFile(blob, `Schichtplan_${monthName}.xlsx`);
    } catch (error) {
      console.error('Fehler beim Exportieren des Schichtplans:', error);
      alert('Der Schichtplan konnte nicht exportiert werden.');
    }
  };

  // Funktion, um die Hintergrundfarbe basierend auf der Schicht zu ermitteln
  const getShiftBackgroundColor = (shift: string): string => {
    switch (shift) {
      case 'F': return '#e6f8e0'; // Hellgrün für Frühschicht
      case 'S': return '#fce4d6'; // Hellorange für Spätschicht
      case 'S0':
      case 'S1':
      case 'S00': return '#fde9d9'; // Helleres Orange für Spätschicht-Varianten
      case 'FS': return '#daeef3'; // Hellblau für FS
      // Uetersen-Schichten
      case '4': return '#c8e6c9'; // Dunkleres Grün für Uetersen-Frühschicht
      case '5': return '#ffcc80'; // Dunkleres Orange für Uetersen-Spätschicht
      case '6': return '#bbdefb'; // Dunkleres Blau für Uetersen-Schichtleiter
      default: return 'transparent';
    }
  };

  // Funktion zum Rendern der Statusfarbe für Constraints
  const getConstraintColor = (status: ConstraintStatus): string => {
    switch (status) {
      case 'ok': return 'success';
      case 'warning': return 'warning';
      case 'violation': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      gap: 4
    }}>
      {/* Header mit Titel und Aktionsbuttons */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h5" component="h2">
          Schichtplan {monthName}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={onGeneratePlan}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : undefined}
          >
            {isLoading ? 'Wird generiert...' : 'Schichtplan generieren'}
          </Button>
          
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={handleExportToExcel}
            disabled={!shiftPlan || isLoading}
            startIcon={<FileDownloadIcon />}
          >
            Als Excel exportieren
          </Button>
        </Box>
      </Box>

      {/* Schichtplan-Tabelle */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : !shiftPlan ? (
        <Alert severity="info">
          Kein Schichtplan verfügbar. Bitte generieren Sie einen neuen Schichtplan.
        </Alert>
      ) : sortedDays.length === 0 ? (
        <Alert severity="warning">
          Der Schichtplan enthält keine gültigen Tage.
        </Alert>
      ) : (
        <TableContainer component={Paper} sx={{ maxHeight: '75vh', overflow: 'auto' }}>
          <Table stickyHeader size="small">
            {/* Tabellenkopf mit Datumsangaben */}
            <TableHead>
              <TableRow>
                <TableCell 
                  sx={{
                    minWidth: 150,
                    position: 'sticky',
                    left: 0,
                    zIndex: 3,
                    backgroundColor: '#f5f5f5',
                    padding: '4px 8px'
                  }}
                >
                  Mitarbeiter
                </TableCell>
                {sortedDays.map(dayKey => {
                  const [day, month, year] = dayKey.split('.').map(Number);
                  const date = new Date(year, month - 1, day);
                  return (
                    <TableCell
                      key={dayKey}
                      align="center"
                      sx={{ minWidth: 50, padding: '4px 6px' }}
                    >
                      {format(date, 'dd.MM.')}
                    </TableCell>
                  );
                })}
              </TableRow>
              
              {/* Wochentage */}
              <TableRow>
                <TableCell 
                  sx={{ 
                    position: 'sticky', 
                    left: 0, 
                    zIndex: 3, 
                    backgroundColor: '#f5f5f5' 
                  }}
                >
                  Rolle
                </TableCell>
                {sortedDays.map(dayKey => {
                  const [day, month, year] = dayKey.split('.').map(Number);
                  const date = new Date(year, month - 1, day);
                  return (
                    <TableCell
                      key={`weekday-${dayKey}`}
                      align="center"
                      sx={{
                        fontWeight: 'bold',
                        padding: '2px 6px',
                        fontSize: '0.75rem',
                        // Wochenenden hervorheben
                        color: date.getDay() === 0 || date.getDay() === 6 ? '#d32f2f' : 'inherit'
                      }}
                    >
                      {format(date, 'EEE', { locale: de })}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            
            {/* Tabellenkörper mit Mitarbeitern und Schichten */}
            <TableBody>
              {employees.map(emp => (
                <TableRow key={emp.id} hover>
                  <TableCell 
                    component="th" 
                    scope="row"
                    sx={{
                      position: 'sticky',
                      left: 0,
                      backgroundColor: 'white',
                      borderRight: '1px solid rgba(224, 224, 224, 1)',
                      fontWeight: 'bold',
                      padding: '2px 8px'
                    }}
                  >
                    <Typography variant="body2" component="div" sx={{ fontSize: '0.8rem' }}>
                      {emp.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.7rem' }}>
                      {emp.role}
                      {emp.hoursPerMonth && ` • ${emp.hoursPerMonth}h/Monat`}
                      {emp.clinic && ` • ${emp.clinic}`}
                    </Typography>
                  </TableCell>
                  
                  {sortedDays.map(dayKey => {
                    const dayPlan = shiftPlan[dayKey] as DayShiftPlan;
                    let assignedShift = '';
                    
                    if (dayPlan) {
                      if (dayPlan) {
                        // Alle Schichten des Tages prüfen
                        for (const shiftName in dayPlan) {
                          if (dayPlan[shiftName].includes(emp.id)) {
                            assignedShift = shiftName;
                            break;
                          }
                        }
                      }
                    }
                    
                    return (
                      <TableCell
                        key={`${emp.id}-${dayKey}`}
                        align="center"
                        sx={{
                          backgroundColor: shiftPlan[dayKey] === null
                            ? '#f5f5f5' // Grau für Tage ohne gültigen Plan
                            : getShiftBackgroundColor(assignedShift),
                          fontWeight: assignedShift ? 'bold' : 'normal',
                          padding: '2px 4px',
                          fontSize: '0.8rem',
                          ...(shiftPlan[dayKey] === null && {
                            color: '#aaa',
                            fontStyle: 'italic'
                          })
                        }}
                      >
                        {shiftPlan[dayKey] === null ? '—' : assignedShift}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Zusammenfassung der Constraints */}
      {constraints.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Zusammenfassung der Vorgaben
          </Typography>
          <Paper sx={{ p: 2 }}>
            <List>
              {constraints.map((constraint, index) => (
                <ListItem 
                  key={`constraint-${index}`}
                  sx={{ 
                    borderLeft: `4px solid`, 
                    borderLeftColor: 
                      constraint.status === 'violation' ? '#f44336' :
                      constraint.status === 'warning' ? '#ff9800' : 
                      '#4caf50',
                    mb: 1,
                    bgcolor: 
                      constraint.status === 'violation' ? '#ffebee' :
                      constraint.status === 'warning' ? '#fff3e0' : 
                      '#e8f5e9',
                  }}
                >
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={
                            constraint.status === 'violation' ? 'Fehler' :
                            constraint.status === 'warning' ? 'Warnung' : 
                            'OK'
                          } 
                          color={getConstraintColor(constraint.status) as any}
                          size="small"
                        />
                        <Typography variant="body2">
                          {constraint.message}
                        </Typography>
                      </Box>
                    } 
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default ShiftTable;