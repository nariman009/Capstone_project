import Rating from 'react-rating';

const Reviews = ({ reviews, businesses, users })=> {
  return (
    <>
      <h1>Number of Reviews: { reviews.length }</h1>
      <ul>
      {reviews.map((review, index) => {
        const business = businesses.find(business => (business.id === review.business_id));
        const user = users.find(user => (user.id === review.user_id));
        
        return (
          <li key={index}>
            {business.name} --{">"} Review By: {user.username}: - Comment: {review.text} - Rate: {review.rate}&nbsp;&nbsp;
            <Rating 
              initialRating={review.rate}
              readonly
              emptySymbol={<span className="icon">☆</span>}
              fullSymbol={<span className="icon">★</span>}
              fractions={4}
            />
          </li>
        );  
      })}
      </ul>
    </>
  );
};

export default Reviews;
