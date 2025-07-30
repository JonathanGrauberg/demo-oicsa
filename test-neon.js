// test-neon.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

(async () => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM usuario');
    console.log('✅ Conexión exitosa. Cantidad de usuarios:', result.rows[0].count);
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  } finally {
    await pool.end();
  }
})();
