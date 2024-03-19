import { Link, Route, Routes } from 'react-router-dom';
import React from 'react';
import Rating from 'react-rating';

import AuthForm from './AuthForm';
import homeImage from './assets/Review-a-Business.png';


const BusinessList = ({ businesses, reviews }) => {
  const businessesWithAverage = businesses.map(business => {
    const filteredReviews = reviews.filter(review => review.business_id === business.id);
    const averageRate = filteredReviews.reduce((acc, curr) => acc + Number(curr.rate), 0) / filteredReviews.length;
    return {
      ...business,
      averageRate: isNaN(averageRate) ? 0 : Number(averageRate.toFixed(1)), // Guard against NaN
      reviewCount: filteredReviews.length
    };
  });

  // Sort businesses by their average rating, in descending order
  const sortedBusinesses = businessesWithAverage.sort((a, b) => b.averageRate - a.averageRate);

  // Select the top three businesses
  const topThreeBusinesses = sortedBusinesses.slice(0, 3);
  
};


const Home = ({ auth, authAction, logout, businesses, users, reviews })=> {
  
  const businessesWithAverage = businesses.map(business => {
    const filteredReviews = reviews.filter(review => review.business_id === business.id);
    const averageRate = filteredReviews.reduce((acc, curr) => acc + Number(curr.rate), 0) / filteredReviews.length;
    return {
      ...business,
      averageRate: isNaN(averageRate) ? 0 : Number(averageRate.toFixed(1)), // Guard against NaN
      reviewCount: filteredReviews.length
    };
  });
  if (businessesWithAverage.length > 0) {
  // Sort businesses by their average rating, in descending order
    const sortedBusinesses = businessesWithAverage.sort((a, b) => b.averageRate - a.averageRate);
    const topThreeBusinesses = sortedBusinesses.slice(0, 3);
  }
  // Select the top three businesses
  
  
  return (
    <div className="mainHome">
      <div className="authHome">
        <h1>Home</h1>
        <p> 
          Welcome to Businesses Review Portal.
          <hr />
        </p>
        <h2>Top Rated Businesses</h2>
        <ul>
          {topThreeBusinesses.map((business, index) => (
            <li key={index}>
              <Link to={`/businesses/${business.id}`}>{business.name}</Link> --{">"} Ave.Rate ({business.reviewCount === 0 ? "No Review" : business.averageRate})
              <Rating
                initialRating={business.averageRate}
                readonly
                emptySymbol={<span className="icon">☆</span>}
                fullSymbol={<span className="icon">★</span>}
                fractions={4}
              />
            </li>
          ))}
        </ul>
        <h2>Last three reviews:</h2>
        <ul>
          {reviews.slice(-3).map((review, index) => {
            const business = businesses.find(business => (business.id === review.business_id));
            return <li key={index}>{business.name} - Review is: {review.text} - Rate is: {review.rate}</li>;
          })}
        </ul>
      </div>
      
      <div>
        <img src={homeImage} alt="Home" className="image-size"/>
      </div>
      
      <div>
        {
          !auth.id ? <>
            <AuthForm authAction={ authAction } mode='Login'/>
            <AuthForm authAction={ authAction } mode='Register'/>
            </>
          : null 
        }
      </div>
    </div>
  );
}


export default Home;
