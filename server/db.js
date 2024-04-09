const sql = require('mssql');

const config = {
  user: 'user_BldgCoord',
  password: 'bldgcoord136',
  database: 'BldgCoord',
  server: 'OFS-GISDB\\OFS_GISDB', // You can use localhost\\instance_name if it's a local DB
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true, // For Azure SQL, set to true. For local SQL Server, set to false.
    trustServerCertificate: true, // Change to true for self-signed certificates
  },
};

async function getConnection() {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (err) {
    console.error('SQL Connection Error: ', err);
  }
}

module.exports = { getConnection, sql };
