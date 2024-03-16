import { Link, Route, Routes } from 'react-router-dom';

const Businesses = ({ businesses })=> {
  return (
    <>
      <h1>Number of Businesses: { businesses.length }</h1>
      <ul>
        {businesses.map((business, index) => (
          <li key={index}>
            <Link to={`/businesses/${business.id}`}>{business.name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}


export default Businesses;
