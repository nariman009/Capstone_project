const Reviews = ({ reviews, businesses })=> {
  return (
    <>
      <h1>Number of Reviews: { reviews.length }</h1>
      <ul>
      {reviews.map((review, index) => {
        // Directly access the business name using the review's business_id
        const business = businesses.find(business => (business.id === review.business_id));
        return <li key={index}>{business.name} - Review is: {review.text} - Rate is: {review.rate}</li>;
      })}
      </ul>
    </>
  );
}


export default Reviews;
