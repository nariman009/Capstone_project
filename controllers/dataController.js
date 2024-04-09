// dataController.js
const db = require('../server/db');

async function fetchData(req, res) {
  const pool = await db.getConnection();
  try {
    const result = await pool.request().query('SELECT BldgID, ParishID, CommonName FROM dbo.lstBldg');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching data', error);
    res.status(500).json({error: 'Internal server error'});
  } finally {
    pool.close(); // close the connection pool
  }
}

module.exports = { fetchData };
