const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/business_review_db');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT || 'shhh';
if(JWT === 'shhh'){
  console.log('If deployed, set process.env.JWT to something other than shhh');
}

const createTables = async()=> {
  const SQL = `
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS businesses;
    
    CREATE TABLE users(
      id UUID PRIMARY KEY,
      username VARCHAR(20) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );
    CREATE TABLE businesses(
      id UUID PRIMARY KEY,
      name VARCHAR(50) NOT NULL UNIQUE
    );
    CREATE TABLE reviews(
      id UUID PRIMARY KEY,
      text VARCHAR(50) NOT NULL,
      user_id UUID REFERENCES users(id) NOT NULL,
      business_id UUID REFERENCES businesses(id) NOT NULL,
      CONSTRAINT unique_review UNIQUE (user_id, business_id, text)

);
  `;
  await client.query(SQL);
};

const createUser = async({ username, password})=> {
  if(!username || !password){
    const error = Error('username and password required!');
    error.status = 401;
    throw error;
  }
  const SQL = `
    INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), username, await bcrypt.hash(password, 5)]);
  return response.rows[0];
};

const authenticate = async({ username, password })=> {
  const SQL = `
    SELECT id, username, password FROM users WHERE username=$1;
  `;
  const response = await client.query(SQL, [username]);
  if(!response.rows.length || (await bcrypt.compare(password, response.rows[0].password)) === false){
    const error = Error('not authorized');
    error.status = 401;
    throw error;
  }
  const token = await jwt.sign({ id: response.rows[0].id}, JWT);
  return { token };
};

const findUserWithToken = async(token)=> {
  let id;
  try{
    const payload = await jwt.verify(token, JWT);
    id = payload.id;
  }
  catch(ex){
    const error = Error('not authorized');
    error.status = 401;
    throw error;
  }
  const SQL = `
    SELECT id, username FROM users WHERE id=$1;
  `;
  const response = await client.query(SQL, [id]);
  if(!response.rows.length){
    const error = Error('not authorized');
    error.status = 401;
    throw error;
  }
  return response.rows[0];
};

const fetchUsers = async()=> {
  const SQL = `
    SELECT id, username FROM users;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const createBusiness = async({ name })=> {
  const SQL = `
      INSERT INTO businesses(id, name)
      VALUES ($1, $2)
      RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name ]);
  return response.rows[0];
};

const fetchBusinesses = async()=> {
  const SQL = `
      SELECT *
      FROM businesses
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const createReview = async({ user_id, business_id, text })=> {
  const SQL = `
      INSERT INTO reviews(id, user_id, business_id, text)
      VALUES ($1, $2, $3, $4)
      RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), user_id, business_id, text]);
  return response.rows[0];
};

const fetchReviews = async()=> {
  const SQL = `
      SELECT *
      FROM reviews

  `;
  const response = await client.query(SQL);
  return response.rows;
};

const destroyReview = async({ id, user_id, business_id }) => {
  console.log(id, user_id);
  const SQL = `
      DELETE FROM reviews
      WHERE id = $1 AND user_id=$2 AND busines_id = $2
  `;
  await client.query(SQL, [id, user_id]);
};

const updateReview = async ({ id, user_id, business_id, text }) => {
  console.log(`Updating review ${id} for ${business_id} for user ${user_id}`);
  const SQL = `
      UPDATE reviews
      SET text = $4
      WHERE id = $1 AND user_id = $2 AND business_id = $3
  `;
  await client.query(SQL, [text, id, user_id]);
};



module.exports = {
  client,
  createTables,
  createUser,
  fetchUsers,
  authenticate,
  findUserWithToken,
  createBusiness,
  createReview,
  fetchBusinesses,
  fetchReviews,
  destroyReview,
  updateReview
};
