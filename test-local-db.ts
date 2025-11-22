
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    connectionString: 'postgresql://postgres:postgres@localhost:5432/postgres',
    connectionTimeoutMillis: 2000
});

async function testLocalConnection() {
    console.log('Testing local PostgreSQL connection...');
    try {
        const client = await pool.connect();
        console.log('✅ Local PostgreSQL is running and accessible!');
        client.release();
        await pool.end();
    } catch (err) {
        console.log('❌ Could not connect to local PostgreSQL.');
        console.log('Error:', err.message);
        await pool.end();
    }
}

testLocalConnection();
