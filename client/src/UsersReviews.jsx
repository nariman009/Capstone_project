import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import Businesses from './Businesses';

const UsersReviews = ({ auth, reviews, users, businesses })=> {
  const { userId } = useParams();
  const [userReviews, setuserReviews] = useState([]);
  const user = users.find(user => (user.id === userId));

  useEffect(() => {
    const filteredReviews = reviews.filter(review => review.user_id === userId);
    setuserReviews(filteredReviews);
  }, [userId, reviews]);

  const deleteAction = async(reviewId) => {
    console.log("reviewId: ", reviewId)
    
    try {
      const response = await fetch(`/api/users/${auth.id}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
  
      });
      
      if (!response.ok){
        const errorResponse  = await response.json();
        console.error("Error deleting review:", errorResponse.message);
  
        throw new Error(errorResponse .message);
        // setReviews(reviews => reviews.filter(review => review.id !== reviewId));
      }
      else {
        // console.log("response", response.json());
      
        // const json = await response.json();
        console.log("Review deleted:");
      // console.log("reviews",reviews)
        
        setuserReviews(filteredReviews => filteredReviews.filter(review => review.id !== reviewId));
        // return (json)
      }
      
      
    } catch (error) {
      console.error("Failed to delete review:", error);
    // Handle or re-throw the error as needed
      throw error; // Re-throwing to allow caller to handle it further if needed
  }
  };
  
  return (
    <>
      <h1>{user.username} has: { userReviews.length } reviews</h1>
      <ul>
        {userReviews.map((userReview, index) => {
            console.log("userReview: ", userReview.id)
            // const user = users.find(user => (user.id === review.user_id));
            const business = businesses.find(business => (business.id === userReview.business_id));
            return (
                <li key={index}>
                    {business.name} --{">"} Comment: {userReview.text} , Rate: {userReview.rate}&nbsp;&nbsp;
                    <button onClick={() => deleteAction(userReview.id)}>X</button>
                </li>
            );
      })}
      </ul>
    </>
  );
}


export default UsersReviews;
