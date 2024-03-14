import CForm from './CForm';

const CReview = ({ auth, users, businesses, reviews })=> {
  
  // const addReview = async (busioness_id) => {
  //   console.log("test")
  // }
  return (
    <>
      <h1>List of Reviews { reviews.length }</h1>
      <ul>
      {reviews.map((review, index) => {
        // Directly access the business name using the review's business_id
        const business = businesses.find(business => (business.id === review.business_id));
        return <li key={index}>{business.name} - Review is: {review.text} - Rate is: {review.rate}</li>;
      })}
      </ul>
      <CForm userId={auth.id} businesses={businesses}/>
    </>
  );
}

// <button onClick={() => addReview(business.id)}>Add Review</button>
export default CReview;

