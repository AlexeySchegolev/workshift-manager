import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Avatar,
  useTheme,
  alpha,
  Fade,
  Tooltip,
  Button,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { EmployeeResponseDto } from '@/api/data-contracts';
import { getRoleColor, getInitials } from './utils/employeeUtils';

interface EmployeeTableProps {
  employees: EmployeeResponseDto[];
  editingId: string | null;
  onEditEmployee: (employee: EmployeeResponseDto) => void;
  onDeleteEmployee: (employee: EmployeeResponseDto) => void;
  onAddEmployee: () => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  editingId,
  onEditEmployee,
  onDeleteEmployee,
  onAddEmployee,
}) => {
  const theme = useTheme();

  return (
    <Fade in timeout={1000}>
      <Card
        sx={{
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleIcon sx={{ fontSize: '1.25rem', color: 'primary.main' }} />
              <Typography variant="h6" component="div">
                Mitarbeiterübersicht
              </Typography>
            </Box>
          }
          action={
            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonAddIcon />}
              onClick={onAddEmployee}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
              }}
            >
              Mitarbeiter hinzufügen
            </Button>
          }
          sx={{ pb: 1 }}
        />
        <CardContent sx={{ pt: 0, px: 0 }}>
          <TableContainer
            sx={{
              borderRadius: 0,
              border: 'none',
              maxHeight: '70vh',
              width: '100%',
            }}
          >
            <Table stickyHeader size="medium">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, width: '30%' }}>
                    Mitarbeiter
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, width: '20%' }}>
                    Rolle
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, width: '15%' }}>
                    Stunden/Monat
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, width: '15%' }}>
                    Standort
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, width: '20%' }}>
                    Aktionen
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <PeopleIcon
                          sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }}
                        />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          Keine Mitarbeiter vorhanden
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Fügen Sie Ihren ersten Mitarbeiter über das Formular oben hinzu.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((employee) => (
                    <TableRow
                      key={employee.id}
                      hover
                      sx={{
                        backgroundColor:
                          employee.id === editingId
                            ? alpha(theme.palette.primary.main, 0.05)
                            : 'inherit',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.03),
                        },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            sx={{
                              bgcolor: getRoleColor(employee.primaryRole, theme),
                              width: 40,
                              height: 40,
                              fontSize: '0.875rem',
                              fontWeight: 600,
                            }}
                          >
                            {getInitials(employee.lastName)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {employee.fullName ||
                                `${employee.firstName} ${employee.lastName}`}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={employee.primaryRole?.name || 'Keine Rolle'}
                          size="small"
                          color={
                            employee.primaryRole?.type === 'shift_leader'
                              ? 'primary'
                              : 'default'
                          }
                          sx={{
                            fontWeight: 500,
                            borderRadius: 1.5,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {employee.hoursPerMonth !== undefined
                            ? employee.hoursPerMonth.toFixed(1)
                            : '0.0'}
                          h
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={employee.location?.name || 'Kein Standort'}
                          size="small"
                          color="info"
                          sx={{
                            fontWeight: 500,
                            borderRadius: 1.5,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 0.5,
                            justifyContent: 'flex-end',
                          }}
                        >
                          <Tooltip title="Bearbeiten">
                            <IconButton
                              color="primary"
                              onClick={() => onEditEmployee(employee)}
                              disabled={!!editingId && editingId !== employee.id}
                              sx={{
                                borderRadius: 2,
                                '&:hover': {
                                  backgroundColor: alpha(
                                    theme.palette.primary.main,
                                    0.08
                                  ),
                                },
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Löschen">
                            <IconButton
                              color="error"
                              onClick={() => onDeleteEmployee(employee)}
                              disabled={!!editingId}
                              sx={{
                                borderRadius: 2,
                                '&:hover': {
                                  backgroundColor: alpha(
                                    theme.palette.error.main,
                                    0.08
                                  ),
                                },
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default EmployeeTable;