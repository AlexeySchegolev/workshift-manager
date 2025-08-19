import ExcelJS from 'exceljs';
import { Employee, MonthlyShiftPlan, DayShiftPlan } from '../models/interfaces';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

/**
 * Service zum Exportieren des Schichtplans als Excel-Datei
 */
export class ExcelExportService {
  /**
   * Exportiert den Schichtplan als Excel-Datei
   * 
   * @param shiftPlan Monatlicher Schichtplan
   * @param employees Mitarbeiterliste
   * @param year Jahr
   * @param month Monat (1-12)
   * @returns Excel-Datei als Blob
   */
  static async exportShiftPlan(
    shiftPlan: MonthlyShiftPlan,
    employees: Employee[],
    year: number,
    month: number
  ): Promise<Blob> {
    // Neues Excel-Workbook erstellen
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Schichtplanungs-App';
    workbook.lastModifiedBy = 'Schichtplanungs-App';
    workbook.created = new Date();
    workbook.modified = new Date();

    // Monatsnamen generieren
    const monthDate = new Date(year, month - 1, 1);
    const monthName = format(monthDate, 'MMMM yyyy', { locale: de });

    // Arbeitsblatt erstellen
    const worksheet = workbook.addWorksheet(`Schichtplan ${monthName}`, {
      properties: { tabColor: { argb: '4F81BD' } }
    });

    // Titel des Arbeitsblatts
    worksheet.mergeCells('A1:G1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = `Schichtplan ${monthName}`;
    titleCell.font = {
      size: 16,
      bold: true
    };
    titleCell.alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };
    worksheet.getRow(1).height = 30;

    // Spaltenbreiten definieren
    worksheet.getColumn('A').width = 30; // Mitarbeitername
    worksheet.getColumn('B').width = 15; // Rolle

    // Alle Tage des Monats extrahieren und sortieren
    const dayKeys = Object.keys(shiftPlan)
      .filter(key => shiftPlan[key] !== null) // Nur Tage mit Schichten
      .sort((a, b) => {
        const [dayA, monthA, yearA] = a.split('.').map(Number);
        const [dayB, monthB, yearB] = b.split('.').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);
        return dateA.getTime() - dateB.getTime();
      });

    // Kopfzeile für Datum und Wochentag erstellen
    const headerRow1 = worksheet.addRow(['Mitarbeiter', 'Rolle']);
    const headerRow2 = worksheet.addRow(['', '']);

    // Stile für die Kopfzeile
    headerRow1.font = { bold: true };
    headerRow2.font = { bold: true };

    // Kopfzeilen mit Daten füllen
    let columnIndex = 3; // A und B sind bereits für Mitarbeiter und Rolle reserviert
    for (const dayKey of dayKeys) {
      const [day, month, year] = dayKey.split('.').map(Number);
      const date = new Date(year, month - 1, day);
      
      // Datum im Format "DD.MM." (z.B. "01.05.")
      headerRow1.getCell(columnIndex).value = format(date, 'dd.MM.');
      
      // Wochentag (z.B. "Mo", "Di", ...)
      headerRow2.getCell(columnIndex).value = format(date, 'EEE', { locale: de });
      
      // Spaltenbreite einstellen
      worksheet.getColumn(columnIndex).width = 12;
      
      columnIndex++;
    }

    // Styling für den Header
    for (let i = 1; i <= columnIndex - 1; i++) {
      headerRow1.getCell(i).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'DCE6F1' }
      };
      headerRow1.getCell(i).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      
      headerRow2.getCell(i).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'DCE6F1' }
      };
      headerRow2.getCell(i).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    }

    // Daten für jeden Mitarbeiter einfügen
    employees.forEach(emp => {
      const rowData: any[] = [emp.name, emp.role];
      
      // Schichten für jeden Tag ermitteln
      for (const dayKey of dayKeys) {
        const dayPlan = shiftPlan[dayKey] as DayShiftPlan;
        let assignedShift = '';
        
        if (dayPlan) {
          // Alle Schichten des Tages prüfen
          for (const shiftName in dayPlan) {
            if (dayPlan[shiftName].includes(emp.id)) {
              assignedShift = shiftName;
              break;
            }
          }
        }
        
        rowData.push(assignedShift);
      }
      
      // Zeile hinzufügen
      const row = worksheet.addRow(rowData);
      
      // Styling für die Zeile
      for (let i = 1; i <= columnIndex - 1; i++) {
        row.getCell(i).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        
        // Mittelzentrierte Ausrichtung für Schichtzellen
        if (i > 2) {
          row.getCell(i).alignment = {
            horizontal: 'center',
            vertical: 'middle'
          };
        }
      }
    });

    // Spezielle Schichten farblich hervorheben
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber <= 2) return; // Kopfzeilen überspringen
      
      for (let i = 3; i < columnIndex; i++) {
        const cell = row.getCell(i);
        const shiftName = cell.value as string;
        
        if (shiftName === 'F') {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'E6F8E0' } // Hellgrün für Frühschicht
          };
        } else if (shiftName === 'S') {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FCE4D6' } // Hellorange für Spätschicht
          };
        } else if (shiftName === 'S0' || shiftName === 'S1' || shiftName === 'S00') {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FDE9D9' } // Helleres Orange für Spätschicht-Varianten
          };
        } else if (shiftName === 'FS') {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'DAEEF3' } // Hellblau für FS
          };
        }
      }
    });

    // Excel-Datei als Blob erzeugen
    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  /**
   * Speichert ein Blob als Datei im Browser
   * 
   * @param blob Excel-Datei als Blob
   * @param fileName Dateiname
   */
  static saveExcelFile(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}