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


app.post('/api/auth/login', async(req, res, next)=> {
  try {
    res.send(await authenticate(req.body));
  }
  catch(ex){
    next(ex);
  }
});

app.post('/api/auth/register', async(req, res, next)=> {
  try {
    const user = await createUser(req.body);
    res.send(await authenticate(req.body));
  }
  catch(ex){
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

app.get('/api/users/reviews',  async(req, res, next)=> {
  try {

    // if(req.params.user_id !== req.user.id){
    //   const error = Error('not authorized');
    //   error.status = 401;
    //   throw error;
    // }
    res.send(await fetchReviews());
  }
  catch(ex){
      next(ex);
  }
});

app.delete('/api/users/:user_id/:business_id/reviews/:id', isLoggedIn,  async(req, res, next)=> {
    try {
        // console.log("del user fav ",req.params.user_id);
        // console.log("del user fav ",req.user.id);
        if(req.params.user_id !== req.user.id){
          const error = Error('not authorized');
          error.status = 401;
          throw error;
        }
        await destroyReview({user_id: req.params.user_id, id: req.params.id});
        res.sendStatus(204);
    }
    catch(ex){
        next(ex);
    }
});

app.post('/api/users/:user_id/:business_id/reviews', isLoggedIn,  async(req, res, next)=> {
    try {
        // console.log("add user fav ",req.params.user_id);
        // console.log("add user fav ",req.user.id);
        if(req.params.user_id !== req.user.id){
          const error = Error('not authorized');
          error.status = 401;
          throw error;
        }
        res.status(201).send(await createReview({ user_id: req.params.user_id, product_id: req.body.product_id}));
    }
    catch(ex){
        next(ex);
    }
});

app.put('/api/users/:user_id/:business_id/reviews/:id', isLoggedIn,  async(req, res, next)=> {
    try {
        // console.log("del user fav ",req.params.user_id);
        // console.log("del user fav ",req.user.id);
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

const [moe, lucy, ethyl, curly, costco, walmart, albertsons, rouses] = await Promise.all([
  createUser({ username: 'moe', password: 'm_pw'}),
  createUser({ username: 'lucy', password: 'l_pw'}),
  createUser({ username: 'ethyl', password: 'e_pw'}),
  createUser({ username: 'curly', password: 'c_pw'}),
  createBusiness({ name: 'Costco'}),
  createBusiness({ name: 'Walmart'}),
  createBusiness({ name: 'Albertsons'}),
  createBusiness({ name: 'Rouses'}),
]);

const review = createReview({ user_id: moe.id, business_id: costco.id, text: "Good Review" });


  console.log(await fetchUsers());

  app.listen(port, ()=> console.log(`listening on port ${port}`));
};

init();

