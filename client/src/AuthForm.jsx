import { useState, useEffect } from 'react'

const AuthForm = ({ authAction, mode })=> {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async(ev) => {
    ev.preventDefault();
    try {
      await authAction({ username, password }, mode);
    }
    catch(ex){
      setError(ex.error);
    }
  }
  return (
    <form onSubmit={ submit }>
      { !!error && <div className='error'>{ error }</div> }
      <h1>{ mode }</h1>
      <input value={ username } placeholder='username' onChange={ ev=> setUsername(ev.target.value)}/>
      <input value={ password} placeholder='password' onChange={ ev=> setPassword(ev.target.value)}/>
      <button>{ mode }</button>
    </form>
  );
}

export default AuthForm;
