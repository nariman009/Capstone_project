import AuthForm from './AuthForm';
// import CreateReview from './CreateReview'

const Home = ({ auth, authAction, logout, businesses, users, reviews })=> {
  return (
    <div>
      <h1>Home</h1>
      <p> 
        Welcome to Businesses Review Portal.
        <hr />
      </p>
      {/*
      <ul>
      {reviews.map((review, index) => {
        const business = businesses.find(business => (business.id === review.business_id));
        return <li key={index}>{business.name} - Review is: {review.text} - Rate is: {review.rate}</li>;
      })}
      </ul>
      */}
      {
        !auth.id ? <>
          <AuthForm authAction={ authAction } mode='login'/>
          <AuthForm authAction={ authAction } mode='register'/>
          </>
        : null 
      }
    </div>
  );
}


export default Home;
