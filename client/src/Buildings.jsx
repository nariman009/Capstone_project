// Buildings.jsx
import React, { useEffect, useState } from 'react';

function Buildings() {
  const [buildings, setBuildings] = useState([]);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await fetch('/api/buildings');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBuildings(data);
      } catch (error) {
        console.error("Could not fetch buildings:", error);
      }
    };

    fetchBuildings();
  }, []);

  return (
    <table className='bc-table'>
      <thead>
        <tr>
          <th>BldgID</th>
          <th>Common Name</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Location</th>
          <th>Email</th>
          <th>PhoneOffice</th>
          <th>CoordType</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {buildings.map((building) => (
          <tr key={building.BldgID}>
            <td>{building.BldgID}</td>
            <td>{building.CommonName}</td>
            <td>{building.FName}</td>
            <td>{building.LName}</td>
            <td>{building.Location}</td>
            <td>{building.Email}</td>
            <td>{building.PhoneOffice}</td>
            <td>{building.CoordType}</td>
            <td>{building.Status ? 'Active' : 'Inactive'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Buildings;
