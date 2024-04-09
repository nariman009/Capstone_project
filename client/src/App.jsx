import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Buildings from './Buildings';
// Assuming Home component exists
import Home from './Home';

function App() {
  return (
    <>
      <h1 className="mainTitle">Buildings Coordinators</h1>
      <nav>
        <Link to='/'>Home</Link>
        <Link to='/buildings'>Buildings</Link>
      </nav>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/buildings' element={<Buildings />} />
      </Routes>
    </>
  );
}

export default App;
