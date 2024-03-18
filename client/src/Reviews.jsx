const Reviews = ({ reviews, businesses, users })=> {
  return (
    <>
      <h1>Number of Reviews: { reviews.length }</h1>
      <ul>
      {reviews.map((review, index) => {
        // Directly access the business name using the review's business_id
        const business = businesses.find(business => (business.id === review.business_id));
        const user = users.find(user => (user.id === review.user_id));
        
        return (
          <li key={index}>
            {business.name} --{">"} Review By: {user.username}: - Comment: {review.text} - Rate: {review.rate}
          </li>
        );  
      })}
      </ul>
    </>
  );
}


export default Reviews;
