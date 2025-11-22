
import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('railway.app') || process.env.DATABASE_URL?.includes('rlwy.net') ? { rejectUnauthorized: false } : undefined
});

async function testConnection() {
    console.log('Testing connection to:', process.env.DATABASE_URL?.split('@')[1]); // Log host only for safety
    try {
        const client = await pool.connect();
        console.log('Successfully connected!');
        const res = await client.query('SELECT NOW()');
        console.log('Server time:', res.rows[0]);
        client.release();
        await pool.end();
    } catch (err) {
        console.error('Connection failed:', err);
        await pool.end();
    }
}

testConnection();
