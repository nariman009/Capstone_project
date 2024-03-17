import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import Businesses from './Businesses';

const BusinessesReviews = ({ reviews, users, businesses })=> {
  const { businessId } = useParams();
  const [businessReviews, setbusinessReviews] = useState([]);
  const business = businesses.find(business => (business.id === businessId));

  useEffect(() => {
    // Filter reviews based on the businessId from URL params
    const filteredReviews = reviews.filter(review => review.business_id === businessId);
    setbusinessReviews(filteredReviews);
  }, [businessId, reviews]);
  
  return (
    <>
      <h1>{business.name} has: { businessReviews.length } reviews</h1>
      <ul>
        {businessReviews.map((businessReview, index) => {
            
            // const user = users.find(user => (user.id === review.user_id));
            const user = users.find(user => (user.id === businessReview.user_id));
            return (
                <li key={index}>
                    Review by: {user.username} - Comment: {businessReview.text} - Rate: {businessReview.rate}
                </li>
            );
      })}
      </ul>
    </>
  );
}


export default BusinessesReviews;
