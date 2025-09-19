import React from 'react';
import { ShiftOccupancy } from '@/services/shift-plan';

interface ShiftTooltipProps {
  shift: ShiftOccupancy;
}

const ShiftTooltip: React.FC<ShiftTooltipProps> = ({ shift }) => {
  return (
    <div style={{ padding: '8px', maxWidth: '300px' }}>
      <div style={{ fontWeight: 600, marginBottom: '4px' }}>
        {shift.shiftName}
      </div>
      
      <div style={{ marginBottom: '4px' }}>
        Zeit: {shift.startTime} - {shift.endTime}
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        Gesamt: {shift.assignedCount} / {shift.requiredCount}
      </div>
      
      {shift.roleOccupancy && shift.roleOccupancy.length > 0 && (
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>
            Belegung nach Rollen:
          </div>
          {shift.roleOccupancy.map((role, index) => (
            <div key={index} style={{ marginLeft: '8px', marginBottom: '4px' }}>
              <div>
                {role.roleName}: {role.assigned} / {role.required}
              </div>
              {role.assignedEmployees && role.assignedEmployees.length > 0 && (
                <div style={{
                  marginLeft: '8px',
                  fontSize: '0.8em',
                  opacity: 0.8,
                  marginTop: '2px'
                }}>
                  {role.assignedEmployees.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {(!shift.assignedEmployees || shift.assignedEmployees.length === 0) && (
        <div style={{ fontStyle: 'italic', opacity: 0.7 }}>
          Keine Zuweisungen
        </div>
      )}
    </div>
  );
};

export default ShiftTooltip;