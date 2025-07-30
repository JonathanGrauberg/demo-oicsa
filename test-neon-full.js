// test-neon-full.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testDB() {
  try {
    console.log("🔍 Probando conexión a Neon...");

    const tables = [
      'usuario',
      'vehiculo',
      'vale',
      'obra',
      'stock'
    ];

    for (const table of tables) {
      try {
        const res = await pool.query(`SELECT COUNT(*) as total FROM ${table}`);
        console.log(`✅ Tabla ${table}: ${res.rows[0].total} registros`);
      } catch (err) {
        console.warn(`⚠️ No se pudo leer la tabla ${table}: ${err.message}`);
      }
    }

  } catch (error) {
    console.error("❌ Error general en conexión:", error);
  } finally {
    await pool.end();
  }
}

testDB();
