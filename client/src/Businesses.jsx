import { Link, Route, Routes } from 'react-router-dom';
import React from 'react';
import Rating from 'react-rating';
import { useState, useEffect } from 'react';


const Businesses = ({ businesses, setBusinesses, reviews })=> {
  const [error, setError] = useState('');
  
  const deleteAction = async(businessId) => {
    // console.log("businessId: ", businessId)
    // if (reviews.find(review => review.business_id == businessId)) {
    //   console.error('This business has some reviews.')  
    // }
    
    try {
      const response = await fetch(`/api/businesses/${businessId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      const json  = await response.json();

      if (response.ok){
        setBusinesses(businesses.filter(business => business.id !== businessId));
        console.log("Deleted business is.");
        // console.error("Error deleting business:", response.message);
        // throw (response);
      }
      else {
        // console.log("response", response.json());
        // const json = await response.json();
        
      // console.log("reviews",reviews)
        throw (json);
        

      }
    } catch (ex) {
      console.error("Failed to delete business:", error);
      setError(ex.error);; 
    }
  };
  
  return (
    <>
      <h1>Number of Businesses: { businesses.length }</h1>
      { !!error && <div className='error'>{ error }</div> }

      <ul>
        {businesses.map((business, index) => {
          const filteredReviews = reviews.filter(review => review.business_id === business.id);
          console.log(filteredReviews);
          const averageRate = Number((filteredReviews.reduce((acc, curr) => acc + Number(curr.rate), 0) / filteredReviews.length).toFixed(1));
          const average = filteredReviews.length === 0 ? "No Review" : averageRate;

          return (
            <li key={index}>
              <Link to={`/businesses/${business.id}`}>{business.name}</Link> --{">"} Ave.Rate ({average})&nbsp;&nbsp;
              <Rating 
                initialRating={average}
                readonly
                emptySymbol={<span className="icon">☆</span>}
                fullSymbol={<span className="icon">★</span>}
                fractions={4}
              />&nbsp;&nbsp;<button onClick={() => deleteAction(business.id)}>X</button>
            </li>
          )
        })}
      </ul>
    </>
  );
}


export default Businesses;
