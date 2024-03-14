import AuthForm from './AuthForm';

const Home = ({ auth, authAction, logout, businesses, users, reviews })=> {
  return (
    <div>
      <h1>Home</h1>
      <p> 
        There are { businesses.length } businesses in our system.
        <br />
        There are { users.length } registered users in our system.
        <br />
        Users can add review for each business. There are { reviews.length } reviews so far.
      </p>
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
