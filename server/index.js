const express = require('express');
const db = require('./db'); // Adjust the path as necessary
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

const path = require('path');
app.get('/', (req, res)=> res.sendFile(path.join(__dirname, '../client/dist/index.html')));
app.use('/assets', express.static(path.join(__dirname, '../client/dist/assets'))); 

app.get('/api/buildings', async (req, res) => {
  const pool = await db.getConnection();
  try {
    // Modified query to join buildings with people through the relation table
    const query = `
      SELECT b.BldgID, b.CommonName, p.FName, p.LName, p.Location, p.Email, p.PhoneOffice, b.Status, t.CoordType
      FROM dbo.lstBldg b
      LEFT JOIN dbo.tblContact c ON b.BldgId = c.BldgId
      LEFT JOIN dbo.lstPerson p On c.PersonID = p.PersonID
      LEFT JOIN dbo.lstCoordType t On c.CoordType = t.CoordTypeID
    `;
    const result = await pool.request().query(query);
    console.log("Raw DB response:", result.recordset);

    const buildings = result.recordset.map(item => ({
      ...item,
      // Convert Status from Buffer to boolean if necessary
      Status: item.Status ? true : false
    }));

    // Convert the buildings object back into an array for the response
    res.json(buildings);
  } catch (error) {
    console.error('Error fetching data', error);
    res.status(500).json({error: 'Internal server error'});
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


