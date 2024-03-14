const Users = ({ users })=> {
  return (
    <>
      <h1>Number of Users: { users.length }</h1>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user.username}</li>
        ))}
      </ul>
    </>
  );
}


export default Users;
