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