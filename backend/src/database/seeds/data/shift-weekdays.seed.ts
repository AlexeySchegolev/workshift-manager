export const shiftWeekdaysSeedData = [
  // Station A - Frühschicht (FSA): nur Montag
  { shiftId: '1', weekday: 1 }, // Montag (JavaScript: 0=Sonntag, 1=Montag)

  // Station B - Frühschicht (FSB): alle Tage (So=0, Mo=1, Di=2, Mi=3, Do=4, Fr=5, Sa=6)
  { shiftId: '4', weekday: 1 }, // Montag
  { shiftId: '4', weekday: 2 }, // Dienstag
  { shiftId: '4', weekday: 3 }, // Mittwoch
  { shiftId: '4', weekday: 4 }, // Donnerstag
  { shiftId: '4', weekday: 5 }, // Freitag
  { shiftId: '4', weekday: 6 }, // Samstag
  { shiftId: '4', weekday: 0 }, // Sonntag

  // Station B - Spätschicht (SSB): alle Tage
  { shiftId: '5', weekday: 1 }, // Montag
  { shiftId: '5', weekday: 2 }, // Dienstag
  { shiftId: '5', weekday: 3 }, // Mittwoch
  { shiftId: '5', weekday: 4 }, // Donnerstag
  { shiftId: '5', weekday: 5 }, // Freitag
  { shiftId: '5', weekday: 6 }, // Samstag
  { shiftId: '5', weekday: 0 }, // Sonntag

  // Station B - Nachtschicht (NSB): alle Tage
  { shiftId: '6', weekday: 1 }, // Montag
  { shiftId: '6', weekday: 2 }, // Dienstag
  { shiftId: '6', weekday: 3 }, // Mittwoch
  { shiftId: '6', weekday: 4 }, // Donnerstag
  { shiftId: '6', weekday: 5 }, // Freitag
  { shiftId: '6', weekday: 6 }, // Samstag
  { shiftId: '6', weekday: 0 }, // Sonntag
];