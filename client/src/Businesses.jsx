import { Link, Route, Routes } from 'react-router-dom';
// import BusinessReviews from './BusinessesReviews';

const Businesses = ({ businesses, reviews })=> {

  return (
    <>
      <h1>Number of Businesses: { businesses.length }</h1>
      <ul>
        {businesses.map((business, index) => {
          const filteredReviews = reviews.filter(review => review.business_id === business.id);
          console.log(filteredReviews);
          const averageRate = Number((filteredReviews.reduce((acc, curr) => acc + Number(curr.rate), 0) / filteredReviews.length).toFixed(1));
          const average = filteredReviews.length === 0 ? "No Review" : averageRate;


          
          return <li key={index}><Link to={`/businesses/${business.id}`}>{business.name}</Link> --{">"} Ave.Rate ({average})</li>
        })}
      </ul>
    </>
  );
}


export default Businesses;
