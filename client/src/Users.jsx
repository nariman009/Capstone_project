import { Link, Route, Routes } from 'react-router-dom';

const Users = ({ users, reviews })=> {
  // const [users, setUsers] = useState([]);

  return (
    <>
      <h1>Number of Users: { users.length }</h1>
      <ul>
        {users.map((user, index) => {
          // const filteredReviews = reviews.filter(review => review.user_id === user.id);
          // console.log(filteredReviews);
          return <li key={index}><Link to={`/users/${user.id}`}>{user.username}</Link></li>;
        })}
      </ul>
    </>
  );
};


export default Users;
