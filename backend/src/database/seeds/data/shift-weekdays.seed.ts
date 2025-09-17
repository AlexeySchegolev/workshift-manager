export const shiftWeekdaysSeedData = [
  // Station A - Frühschicht (FSA): Mo, Di, Mi, Do, Fr, Sa
  { shiftId: '1', weekday: 0 }, // Montag (Frontend: 0=Montag)
  { shiftId: '1', weekday: 1 }, // Dienstag
  { shiftId: '1', weekday: 2 }, // Mittwoch
  { shiftId: '1', weekday: 3 }, // Donnerstag
  { shiftId: '1', weekday: 4 }, // Freitag
  { shiftId: '1', weekday: 5 }, // Samstag

  // Station A - Spätschicht (SSA): Mo, Mi, Fr
  { shiftId: '2', weekday: 0 }, // Montag
  { shiftId: '2', weekday: 2 }, // Mittwoch
  { shiftId: '2', weekday: 4 }, // Freitag

  // Station B - Frühschicht (FSB): alle Tage (Mo=0, Di=1, Mi=2, Do=3, Fr=4, Sa=5, So=6)
  { shiftId: '4', weekday: 0 }, // Montag
  { shiftId: '4', weekday: 1 }, // Dienstag
  { shiftId: '4', weekday: 2 }, // Mittwoch
  { shiftId: '4', weekday: 3 }, // Donnerstag
  { shiftId: '4', weekday: 4 }, // Freitag
  { shiftId: '4', weekday: 5 }, // Samstag
  { shiftId: '4', weekday: 6 }, // Sonntag

  // Station B - Spätschicht (SSB): alle Tage
  { shiftId: '5', weekday: 0 }, // Montag
  { shiftId: '5', weekday: 1 }, // Dienstag
  { shiftId: '5', weekday: 2 }, // Mittwoch
  { shiftId: '5', weekday: 3 }, // Donnerstag
  { shiftId: '5', weekday: 4 }, // Freitag
  { shiftId: '5', weekday: 5 }, // Samstag
  { shiftId: '5', weekday: 6 }, // Sonntag

  // Station B - Nachtschicht (NSB): alle Tage
  { shiftId: '6', weekday: 0 }, // Montag
  { shiftId: '6', weekday: 1 }, // Dienstag
  { shiftId: '6', weekday: 2 }, // Mittwoch
  { shiftId: '6', weekday: 3 }, // Donnerstag
  { shiftId: '6', weekday: 4 }, // Freitag
  { shiftId: '6', weekday: 5 }, // Samstag
  { shiftId: '6', weekday: 6 }, // Sonntag
];