# Vereinfachtes Regelwerk - Grundlegende Schichtplanung ✅

## Zusammenfassung der Vereinfachung

Das Schichtplanungssystem wurde grundlegend vereinfacht, um die Komplexität zu reduzieren und schrittweise testbar zu machen.

## Vorher vs. Nachher

### ❌ Alte komplexe Schichten (entfernt):
- **FS** (Frühschicht Special)
- **S0** (Spätschicht 0) 
- **S1** (Spätschicht 1)
- **S00** (Spätschicht 00)

### ✅ Neue vereinfachte Schichten:
- **F** (Frühschicht): 06:00-13:00
- **S** (Spätschicht): 12:00-19:00

## Geänderte Dateien

### 1. `src/data/defaultShifts.ts`
- **Lange Tage** (Mo/Mi/Fr): Nur F und S
- **Kurze Tage** (Di/Do/Sa): Nur F
- Alle komplexen Spätschichten entfernt

### 2. `src/services/ShiftPlanningService.ts`
- **Samstags-Logik**: Nur F-Schicht mit einem Schichtleiter
- **Schichtpriorisierung**: Vereinfacht auf F zuerst, dann S
- Alle Referenzen auf alte Spezialschichten entfernt

### 3. `src/services/ShiftPlanningBacktrackingService.ts`
- **Vereinfachte Logik**: Alle Schichten werden gleich behandelt
- **Nur Schichtleiter**: Alle anderen Rollen bleiben auskommentiert
- Spezialschicht-Behandlung entfernt

## Aktuelle Schichtstruktur

### Elmshorn:
- **Montag/Mittwoch/Freitag** (lange Tage): F + S
- **Dienstag/Donnerstag** (kurze Tage): F
- **Samstag**: Nur F mit einem Schichtleiter
- **Sonntag**: Keine Schichten

### Uetersen:
- **Montag/Mittwoch/Freitag**: Schicht "6" (10 Stunden: 06:00-16:00)
- **Andere Tage**: Keine Schichten

## Vorteile der Vereinfachung

1. **Weniger Komplexität**: Nur 2 Schichttypen statt 5+
2. **Einfachere Tests**: Klare, vorhersagbare Schichtmuster
3. **Bessere Wartbarkeit**: Weniger Code, weniger Fehlerquellen
4. **Schrittweise Erweiterung**: Basis für weitere Regeln

## Nächste Schritte

Mit diesem vereinfachten Regelwerk können jetzt schrittweise weitere Funktionen hinzugefügt werden:

1. ✅ **Schichtleiter-Planung** (aktiv)
2. 🔄 **Pfleger hinzufügen**
3. 🔄 **Pflegehelfer hinzufügen**
4. 🔄 **Samstagsregeln**
5. 🔄 **Stundenverteilung**

## Test-Bereitschaft

✅ **Das vereinfachte System ist bereit für Tests!**

Die Anwender können jetzt:
- Einfache Schichtpläne mit nur F und S Schichten testen
- Die Schichtleiter-Verteilung prüfen
- Feedback zur Grundstruktur geben

---
*Erstellt am: 21.08.2025*
*Status: ✅ Grundlegende Vereinfachung abgeschlossen*