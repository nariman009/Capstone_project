import { Link } from 'react-router-dom';

const Users = ({ auth, users, reviews, handleSetAdmin, handleUnsetAdmin })=> {
  // console.log("auth.id ", auth.id);
  return (
    <>
      <h1>Number of Users: { users.length }</h1>
      
      { auth.id && !auth.is_admin ? <h3>Login with admin account to manage users</h3> : <h3>Users List</h3> }
      <hr />
      { !auth.id && <h3>Login to see reviews added by each user.</h3> }
      <hr />
      <ul>
        {users.map((user, index) => {
          
          return (
            <li key={index}>
              {auth.id ? (<Link to={`/users/${user.id}`}>{user.username}</Link>) : (<span>{user.username}</span>)} --{">"} Is Admin: {user.is_admin ? 'Yes' : 'No'}&nbsp;&nbsp;
              {auth.id && auth.is_admin && !user.is_admin && (
                <button onClick={() => handleSetAdmin(user.id)}>Set Admin</button>
              )}
              {auth.id && auth.is_admin && user.is_admin && user.id !== auth.id && (
                <button onClick={() => handleUnsetAdmin(user.id)}>Unset Admin</button>
              )}
            </li>
            );
        })}
      </ul>
    </>
  );
};

export default Users;
