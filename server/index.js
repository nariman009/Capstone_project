const {
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
  updateReview,
  setAdministrator,
  unsetAdministrator,
  destroyBusiness
} = require('./db');
const express = require('express');
const app = express();
app.use(express.json());

//for deployment only
const path = require('path');
app.get('/', (req, res)=> res.sendFile(path.join(__dirname, '../client/dist/index.html')));
app.use('/assets', express.static(path.join(__dirname, '../client/dist/assets'))); 

const isLoggedIn = async(req, res, next)=> {
  try{
    req.user = await findUserWithToken(req.headers.authorization);
    next();
  }
  catch(ex){
    next(ex);
  }
};

app.post('/api/users/:userId/set_admin', async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedUser = await setAdministrator(userId);
    if (updatedUser) {
      res.status(200).send({ message: "User role updated to admin" });
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).send({ error: "Server error" });
  }
});

app.post('/api/users/:userId/unset_admin', async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedUser = await unsetAdministrator(userId);
    
    if (updatedUser) {
      res.status(200).send({ message: "User role updated to admin" });
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).send({ error: "Server error" });
  }
});

app.post('/api/auth/login', async(req, res, next)=> {
  try {
    const token = await authenticate(req.body);
    res.send({token});
  }
  catch(ex){
    if (ex.message === 'not authorized'){
      ex.message = 'Not registered.';
    } 
    next(ex);
  }
});

app.post('/api/auth/Register', async(req, res, next)=> {
  try {
    const user = await createUser(req.body);
    const token = await authenticate(req.body);
    res.send({user, token});
  }
  catch(ex) {
    if (ex.code === '23505'){
      ex.message = 'User already exists.';
    }  
    next(ex);
  }
});

app.get('/api/auth/me', isLoggedIn, (req, res, next)=> {
  try {
    res.send(req.user);
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/users', async(req, res, next)=> {
  try {
    res.send(await fetchUsers());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/businesses',  async(req, res, next)=> {
  try {
    res.send(await fetchBusinesses());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/reviews',  async(req, res, next)=> {
  try {
    res.send(await fetchReviews());
  }
  catch(ex){
      next(ex);
  }
});

app.delete('/api/businesses/:id',  async(req, res, next)=> {
  try {
    await destroyBusiness(req.params.id);
    res.sendStatus(204);
  }
  catch(ex){
    if (ex.code === '23503'){
      ex.message = 'This business has some reviews.';
  }
    next(ex);
  }
});

app.post('/api/businesses',  async(req, res, next)=> {
  try {
    const business = await createBusiness(req.body);
    res.send({business});
  }
  catch(ex) {
    if (ex.code === '23505'){
      ex.message = 'Business already exists.';
    }  
    next(ex);
  }
});

app.delete('/api/users/:user_id/reviews/:id',  async(req, res, next)=> {
  try {
    await destroyReview(req.params.id);
    res.sendStatus(204);
  }
  catch(ex){

    next(ex);
  }
});

app.post('/api/users/:userId/:selectedOption/reviews',  async(req, res, next)=> {
  try {
      res.status(201).send(await createReview({ user_id: req.params.userId, business_id: req.params.selectedOption, text: req.body.text, rate: req.body.rate}));
  }
  catch(ex){
    return res.status(400).send({message: 'Review already exists'});
  }
});

app.put('/api/users/:user_id/:business_id/reviews/:id', isLoggedIn,  async(req, res, next)=> {
  try {
      if(req.params.user_id !== req.user.id){
        const error = Error('not authorized');
        error.status = 401;
        throw error;
      }
      await updateReview({user_id: req.params.user_id, id: req.params.id});
      res.sendStatus(204);
  }
  catch(ex){
      next(ex);
  }
});

app.use((err, req, res, next)=> {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message ? err.message : err });
});

const init = async()=> {
  const port = process.env.PORT || 3000;
  await client.connect();
  console.log('connected to database');

  await createTables();
  console.log('tables created');

const [moe, lucy, ethyl, curly, nariman, costco, walmart, albertsons, rouses] = await Promise.all([
  createUser({ username: 'moe', password: 'm_pw'}),
  createUser({ username: 'lucy', password: 'l_pw'}),
  createUser({ username: 'ethyl', password: 'e_pw'}),
  createUser({ username: 'curly', password: 'c_pw'}),
  createUser({ username: 'nariman', password: '123'}),

  createBusiness({ name: 'Costco', image_url: 'https://mobilecontent.costco.com/live/resource/img/static-folder-app-icon/app-icon.png'}),
  createBusiness({ name: 'Walmart', image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTltv3KnyQDiqaKZXvvZH4Seb9Ry13dZGK0dDr67uUsGA&s'}),
  createBusiness({ name: 'Albertsons', image_url: 'https://logos-world.net/wp-content/uploads/2021/12/Albertsons-Symbol.png'}),
  createBusiness({ name: 'Rouses', image_url: 'https://play-lh.googleusercontent.com/Jstr50AZFAkuH0zlywm8oCWOhd6BtO9cnp4_Ni3qXKZfPBrTieI3tyDve6sr0pELtQ=w240-h480-rw'}),
]);


  await setAdministrator(nariman.id);
  console.log('Administrator set.');

  app.listen(port, ()=> console.log(`listening on port ${port}`));
};

init();

