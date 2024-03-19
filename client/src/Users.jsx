import { Link } from 'react-router-dom';

const Users = ({ auth, users, reviews, handleSetAdmin, handleUnsetAdmin })=> {

  return (
    <>
      <h1>Number of Users: { users.length }</h1>
      { auth.id ? <h3>Users</h3> : <h3>Please loginin with admin account to manage users</h3> }
      <ul>
        {users.map((user, index) => {
          // console.log(user.id);
          // console.log(auth.id);
          
          return (

            <li key={index}>
              <Link to={`/users/${user.id}`}>{user.username}</Link> --{">"} Is Admin: {user.is_admin ? 'Yes' : 'No'}&nbsp;&nbsp;
              {auth.id && !user.is_admin && (
                <button onClick={() => handleSetAdmin(user.id)}>Set Admin</button>
              )}
              {auth.id && user.is_admin && user.id !== auth.id && (
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
