import { PGlite } from '@electric-sql/pglite';

let pgl;
const channel = new BroadcastChannel('pglite-patient-app'); // For multi-tab sync

async function initializePglite() {
    if (!pgl) {
        pgl = new PGlite();
        console.log('Pglite initialized.');
        await pgl.exec(`
            CREATE TABLE IF NOT EXISTS patients (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                dob DATE NOT NULL,
                gender TEXT NOT NULL,
                address TEXT NOT NULL
            );
        `);
        console.log('Patients table ensured.');
    }
}

async function executeQueryAndNotify(query, params = []) {
    try {
        const result = await pgl.query(query, params);
        channel.postMessage('data_updated'); // Notify other tabs
        return result;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
}


const patientRegistrationForm = document.getElementById('patientRegistrationForm');

patientRegistrationForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const dob = document.getElementById('dob').value;
    const gender = document.getElementById('gender').value;
    const address = document.getElementById('address').value;

    try {
        await executeQueryAndNotify(
            'INSERT INTO patients (name, dob, gender, address) VALUES ($1, $2, $3, $4);',
            [name, dob, gender, address]
        );
        alert('Patient registered successfully!');
        patientRegistrationForm.reset();
        await loadPatients(); // Refresh the list
    } catch (error) {
        alert('Error registering patient: ' + error.message);
    }
});

const patientTableBody = document.querySelector('#patientTable tbody');

async function loadPatients() {
    try {
        const result = await pgl.query('SELECT * FROM patients ORDER BY id DESC;');
        patientTableBody.innerHTML = ''; // Clear existing rows
        result.rows.forEach(patient => {
            const row = patientTableBody.insertRow();
            row.insertCell().textContent = patient.id;
            row.insertCell().textContent = patient.name;
            row.insertCell().textContent = patient.dob;
            row.insertCell().textContent = patient.gender;
            row.insertCell().textContent = patient.address;
        });
    } catch (error) {
        console.error('Error loading patients:', error);
        patientTableBody.innerHTML = `<tr><td colspan="5">Error loading patients: ${error.message}</td></tr>`;
    }
}

const sqlQueryInput = document.getElementById('sqlQueryInput');
const executeSqlButton = document.getElementById('executeSql');
const queryResultDiv = document.getElementById('queryResult');

executeSqlButton.addEventListener('click', async () => {
    const query = sqlQueryInput.value.trim();
    if (!query) {
        queryResultDiv.textContent = 'Please enter a SQL query.';
        return;
    }

    try {
        const result = await pgl.query(query); // No need to notify for read-only queries
        queryResultDiv.textContent = JSON.stringify(result.rows, null, 2);
    } catch (error) {
        queryResultDiv.textContent = 'Error executing query: ' + error.message;
        console.error('SQL Query Error:', error);
    }
});


channel.addEventListener('message', async (event) => {
    if (event.data === 'data_updated') {
        console.log('Received data_updated message, reloading patients...');
        await loadPatients(); // Reload patients when another tab updates data
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    await initializePglite();
    await loadPatients();
});