import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const UsersReviews = ({ auth, reviews, setReviews, users, businesses })=> {
  const { userId } = useParams();
  const [userReviews, setuserReviews] = useState([]);
  const user = users.find(user => (user.id === userId));

  useEffect(() => {
    const filteredReviews = reviews.filter(review => review.user_id === userId);
    setuserReviews(filteredReviews);
  }, [userId, reviews]);

  const deleteAction = async(reviewId) => {
    try {
      const response = await fetch(`/api/users/${auth.id}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok){
        const errorResponse  = await response.json();
        console.error("Error deleting review:", errorResponse.message);
        throw new Error(errorResponse .message);
      }
      else {
        // console.log("response", response.json());
        console.log("Review deleted:");
        // console.log("reviews",reviews
        setuserReviews(filteredReviews => filteredReviews.filter(review => review.id !== reviewId));
        setReviews(reviews => reviews.filter(review => review.id !== reviewId));
      }
    } catch (error) {
      console.error("Failed to delete review:", error);
      throw error;
  }};
  
  return (
    <>
      { auth.id ? <h3>Users</h3> : <h3>Login with admin account to manage reviews</h3> }
      <h1>{user.username} has: { userReviews.length } reviews</h1>
      <ul>
        {userReviews.map((userReview, index) => {
            const business = businesses.find(business => (business.id === userReview.business_id));
            return (
                <li key={index}>
                    {business.name} --{">"} Comment: {userReview.text} , Rate: {userReview.rate}&nbsp;&nbsp;
                    {auth.id && auth.is_admin && <button onClick={() => deleteAction(userReview.id)}>X</button>}
                </li>
            );
      })}
      </ul>
    </>
  );
};

export default UsersReviews;
