import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  IconButton, 
  Typography, 
  Dialog,
  DialogTitle,
  DialogContent,
  Paper
} from '@mui/material';
import { 
  ChevronLeft as ChevronLeftIcon, 
  ChevronRight as ChevronRightIcon,
  CalendarMonth as CalendarIcon
} from '@mui/icons-material';
import { format, addMonths, subMonths, getYear, setMonth, setYear } from 'date-fns';
import { de } from 'date-fns/locale';

interface MonthSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

/**
 * Component for selecting the month for shift planning
 */
const MonthSelector: React.FC<MonthSelectorProps> = ({ selectedDate, onDateChange }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // Switch to previous month
  const handlePreviousMonth = () => {
    onDateChange(subMonths(selectedDate, 1));
  };
  
  // Switch to next month
  const handleNextMonth = () => {
    onDateChange(addMonths(selectedDate, 1));
  };
  
  // Open calendar dialog
  const handleOpenCalendar = () => {
    setIsCalendarOpen(true);
  };
  
  // Close calendar dialog
  const handleCloseCalendar = () => {
    setIsCalendarOpen(false);
  };
  
  // Select month
  const handleSelectMonth = (month: number) => {
    const newDate = setMonth(selectedDate, month);
    onDateChange(newDate);
    setIsCalendarOpen(false);
  };
  
  // Change year
  const handleYearChange = (increment: number) => {
    const currentYear = getYear(selectedDate);
    const newDate = setYear(selectedDate, currentYear + increment);
    onDateChange(newDate);
  };
  
  // Formatted month name and year
  const formattedDate = format(selectedDate, 'MMMM yyyy', { locale: de });
  
  // List of months for calendar dialog
  const months = [
    'Januar', 'Februar', 'März', 'April', 
    'Mai', 'Juni', 'Juli', 'August', 
    'September', 'Oktober', 'November', 'Dezember'
  ];
  
  // Current year for calendar dialog
  const currentYear = getYear(selectedDate);

  // Current month (0-based)
  const currentMonth = selectedDate.getMonth();
  
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      margin: '20px 0',
      padding: '10px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px'
    }}>
      <IconButton onClick={handlePreviousMonth} aria-label="Vorheriger Monat">
        <ChevronLeftIcon />
      </IconButton>
      
      <Button 
        onClick={handleOpenCalendar}
        startIcon={<CalendarIcon />}
        variant="text"
        size="large"
        sx={{ 
          fontSize: '1.2rem',
          fontWeight: 'bold',
          padding: '8px 16px',
          textTransform: 'capitalize'
        }}
      >
        {formattedDate}
      </Button>
      
      <IconButton onClick={handleNextMonth} aria-label="Nächster Monat">
        <ChevronRightIcon />
      </IconButton>
      
      {/* Calendar Dialog */}
      <Dialog open={isCalendarOpen} onClose={handleCloseCalendar}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <IconButton onClick={() => handleYearChange(-1)}>
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant="h6">{currentYear}</Typography>
            <IconButton onClick={() => handleYearChange(1)}>
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 2
            }}
          >
            {months.map((month, index) => (
              <Paper
                key={month}
                elevation={index === currentMonth ? 8 : 1}
                sx={{
                  padding: '10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: index === currentMonth ? '#bbdefb' : 'white',
                  '&:hover': {
                    backgroundColor: index === currentMonth ? '#bbdefb' : '#f5f5f5'
                  }
                }}
                onClick={() => handleSelectMonth(index)}
              >
                {month}
              </Paper>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MonthSelector;