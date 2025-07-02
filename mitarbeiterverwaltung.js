document.addEventListener('DOMContentLoaded', () => {
    const employeeForm = document.querySelector('.employee-form');
    const employeeIdInput = document.getElementById('employeeId');
    const employeeNameInput = document.getElementById('employeeName');
    const employeeRoleInput = document.getElementById('employeeRole');
    const employeeHoursInput = document.getElementById('employeeHours');
    const saveEmployeeBtn = document.getElementById('saveEmployeeBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const employeeTableBody = document.getElementById('employeeTableBody');

    let employees = [];

    // Funktion zum Laden der Mitarbeiterdaten
    async function loadEmployees() {
        const storedEmployees = localStorage.getItem('employees');
        if (storedEmployees) {
            try {
                employees = JSON.parse(storedEmployees);
                console.log("Mitarbeiterdaten aus localStorage geladen.");
            } catch (e) {
                console.error("Fehler beim Parsen der Mitarbeiterdaten aus localStorage:", e);
                // Fallback auf JSON-Datei, falls localStorage korrupt ist
                employees = await fetchInitialEmployees();
            }
        } else {
            // Wenn nichts im localStorage, lade von der JSON-Datei
            employees = await fetchInitialEmployees();
        }
        renderEmployees();
    }

    // Funktion zum Laden der initialen Mitarbeiterdaten aus mitarbeiter.json
    async function fetchInitialEmployees() {
        try {
            const response = await fetch('mitarbeiter.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Speichere die initialen Mitarbeiterdaten im localStorage, wenn sie geladen werden
            localStorage.setItem('employees', JSON.stringify(data.employees));
            return data.employees;
        } catch (error) {
            console.error("Fehler beim Laden der initialen Mitarbeiterdaten aus mitarbeiter.json:", error);
            // Fallback: Versuche, die Mitarbeiterdaten direkt aus einer im Code eingebetteten Variable zu laden
            if (typeof window.__DEFAULT_EMPLOYEES__ !== 'undefined') {
                localStorage.setItem('employees', JSON.stringify(window.__DEFAULT_EMPLOYEES__));
                return window.__DEFAULT_EMPLOYEES__;
            }
            return []; // Leeres Array bei Fehler
        }
    }

    // Funktion zum Speichern der Mitarbeiterdaten im localStorage
    function saveEmployees() {
        localStorage.setItem('employees', JSON.stringify(employees));
    }

    // Funktion zum Rendern der Mitarbeiterliste
    function renderEmployees() {
        employeeTableBody.innerHTML = '';
        if (employees.length === 0) {
            employeeTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Noch keine Mitarbeiter vorhanden.</td></tr>';
            return;
        }
        employees.forEach((emp, index) => {
            const row = employeeTableBody.insertRow();
            row.insertCell().textContent = emp.name;
            row.insertCell().textContent = emp.role;
            row.insertCell().textContent = emp.hoursPerWeek;

            const actionsCell = row.insertCell();
            const editButton = document.createElement('button');
            editButton.textContent = 'Bearbeiten';
            editButton.classList.add('edit');
            editButton.addEventListener('click', () => editEmployee(index));
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Löschen';
            deleteButton.classList.add('delete');
            deleteButton.addEventListener('click', () => deleteEmployee(index));
            actionsCell.appendChild(deleteButton);
        });
    }

    // Funktion zum Hinzufügen oder Aktualisieren eines Mitarbeiters
    employeeForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Verhindert das Neuladen der Seite

        const name = employeeNameInput.value.trim();
        const role = employeeRoleInput.value;
        const hoursPerWeek = parseInt(employeeHoursInput.value, 10);
        const id = employeeIdInput.value;

        if (!name || !role || isNaN(hoursPerWeek) || hoursPerWeek <= 0) {
            alert('Bitte alle Felder korrekt ausfüllen.');
            return;
        }

        if (id === '') {
            // Neuen Mitarbeiter hinzufügen
            employees.push({ name, role, hoursPerWeek });
        } else {
            // Bestehenden Mitarbeiter aktualisieren
            const index = parseInt(id, 10);
            if (index >= 0 && index < employees.length) {
                employees[index] = { name, role, hoursPerWeek };
            }
        }

        saveEmployees();
        renderEmployees();
        clearForm();
    });

    // Funktion zum Bearbeiten eines Mitarbeiters
    function editEmployee(index) {
        const emp = employees[index];
        employeeIdInput.value = index;
        employeeNameInput.value = emp.name;
        employeeRoleInput.value = emp.role;
        employeeHoursInput.value = emp.hoursPerWeek;

        saveEmployeeBtn.textContent = 'Änderungen speichern';
        cancelEditBtn.style.display = 'inline-block';
    }

    // Funktion zum Abbrechen des Bearbeitungsmodus
    cancelEditBtn.addEventListener('click', () => {
        clearForm();
    });

    // Funktion zum Löschen eines Mitarbeiters
    function deleteEmployee(index) {
        if (confirm(`Möchten Sie ${employees[index].name} wirklich löschen?`)) {
            employees.splice(index, 1);
            saveEmployees();
            renderEmployees();
            clearForm(); // Formular zurücksetzen, falls der gelöschte Mitarbeiter gerade bearbeitet wurde
        }
    }

    // Funktion zum Zurücksetzen des Formulars
    function clearForm() {
        employeeIdInput.value = '';
        employeeNameInput.value = '';
        employeeRoleInput.value = '';
        employeeHoursInput.value = '';
        saveEmployeeBtn.textContent = 'Mitarbeiter speichern';
        cancelEditBtn.style.display = 'none';
    }

    // Initiales Laden der Mitarbeiterdaten beim Start
    loadEmployees();
});
