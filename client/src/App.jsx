import { useState, useEffect } from 'react'
import { Link, Route, Routes } from 'react-router-dom';
import Users from './Users';
import Businesses from './Businesses';
import Reviews from './Reviews';
import CreateReview from './CreateReview';
import Home from './Home';
import BusinessesReviews from './BusinessesReviews';
import UsersReviews from './UsersReviews';

function App() {
  const [auth, setAuth] = useState({});
  const [users, setUsers] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(()=> {
    attemptLoginWithToken();
  }, []);

  const attemptLoginWithToken = async()=> {
    const token = window.localStorage.getItem('token');
    if(token){
      const response = await fetch(`/api/auth/me`, {
        headers: {
          authorization: token
        }
      });
      const json = await response.json();
      if(response.ok){
        setAuth(json);
      }
      else {
        window.localStorage.removeItem('token');
      }
    }
  };
  
  const handleSetAdmin = async (userId) => {
    try {
      console.log(userId)
      const response = await fetch(`/api/users/${userId}/set_admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth.token
        },
        body: JSON.stringify({ is_admin: true }),
      });
      if (!response.ok) {
        throw new Error('Failed to update user role');
      }
      setUsers(users.map(user => user.id === userId ? {...user, is_admin: true} : user));
    } catch (err) {
      throw new Error(err.message);
    }
  };
  
  const handleUnsetAdmin = async (userId) => {
    try {
      console.log("userId", userId)
      const response = await fetch(`/api/users/${userId}/unset_admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth.token
        },
        body: JSON.stringify({ is_admin: false }),
      });
      if (!response.ok) {
        throw new Error('Failed to update user role');
      }
      setUsers(users.map(user => user.id === userId ? {...user, is_admin: false} : user));
    } catch (err) {
      throw new Error(err.message);
    }
  };
  
  const createAction = async({businessId, comment, rate}) => {
    console.log({"auth.id": auth.id, "businessId": businessId.id})
    const response = await fetch(`/api/users/${auth.id}/${businessId.id}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({text: comment, rate: rate}),
    });
    const json = await response.json();
    if (response.ok){
      console.log("review",json)
      setReviews([...reviews, json]);
    }
    else {
      console.error(json.message);
      throw new Error(json.message);
    }
  return (json)
  };
  
  const authAction = async(credentials, mode)=> {
    const response = await fetch(`/api/auth/${mode}`, {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const json = await response.json();
    // console.log("user]: ", json.user)
    if(response.ok){
      window.localStorage.setItem('token', json.token.token);
      attemptLoginWithToken();
      
      if (mode == 'Register'){
        setUsers([...users, json.user]);
      }
    }  
    else {
      throw json;
    }
  };

  const logout = ()=> {
    window.localStorage.removeItem('token');
    setAuth({});
  };
  
  useEffect(()=> {
    const fetchUsers = async()=> {
      const response = await fetch('/api/users');
      const json = await response.json();
      setUsers(json);
    };

    fetchUsers();
  }, []);
  
  useEffect(()=> {
    const fetchBusinesses = async()=> {
      const response = await fetch('/api/businesses');
      const json = await response.json();
      setBusinesses(json);
    };

    fetchBusinesses();
  }, []);
  
  useEffect(()=> {
    const fetchReviews = async()=> {
      const response = await fetch('/api/reviews');
      const json = await response.json();
      setReviews(json);
    };

    fetchReviews();
  }, []);

  return (
    <>
      <h1 className="mainTitle">Acme Business Reviews</h1>

      <nav>
        <Link to='/'>Home</Link>
        <Link to='/businesses'>Businesses ({ businesses.length })</Link>
        <Link to='/reviews'>Reviews ({ reviews.length })</Link>
        <Link to='/users'>Users ({ users.length })</Link>
        {
          !!auth.id ? <Link to='/createReview'>Create Review</Link> : <Link to='/'>Register/Login</Link>
        }
        {
          !!auth.id && <button onClick={ logout }>Logout "{ auth.username }"</button>
        }
      </nav>
      {
        !!auth.id && <h3>Welcome to Business Reviews "{ auth.username }"</h3>
      } 
      <Routes>
        <Route path='/' element={
          <Home
            authAction = { authAction }
            auth = { auth }
            businesses = { businesses }
            users = { users }
            reviews = { reviews }
          />
        } />
        <Route path='/businesses' element={<Businesses businesses={ businesses } setBusinesses={setBusinesses} reviews={reviews}/>} />
        <Route path='/reviews' element={<Reviews businesses={ businesses } reviews={ reviews } users={ users } />} />
        <Route path='/users' element={<Users auth = { auth } users={ users} reviews={ reviews } handleSetAdmin={ handleSetAdmin } handleUnsetAdmin={ handleUnsetAdmin } />} />
        <Route path='/businesses/:businessId' element={<BusinessesReviews businesses={ businesses } reviews={reviews} users={users} />} />
        <Route path='/users/:userId' element={<UsersReviews auth = { auth } businesses={ businesses } reviews={reviews} setReviews={setReviews} users={users} />} />

        {
          !!auth.id && <Route path='/createReview' element={<CreateReview auth = { auth } users = { users } businesses={ businesses } createAction = { createAction }/>} />
        }

      </Routes>
    </>
  )
}

export default App
