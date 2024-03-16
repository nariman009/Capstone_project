const Reviews = ({ reviews, businesses, users })=> {
  return (
    <>
      <h1>Number of Reviews: { reviews.length }</h1>
      <ul>
      {reviews.map((review, index) => {
        // Directly access the business name using the review's business_id
        const business = businesses.find(business => (business.id === review.business_id));
        const user = users.find(user => (user.id === review.user_id));
        
        return <li key={index}>{user.username}: {business.name} - Review is: {review.text} - Rate is: {review.rate}</li>;
      })}
      </ul>
    </>
  );
}


export default Reviews;
