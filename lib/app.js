const express = require('express');
const cors = require('cors');
// const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');
const { getContact } = require('./routes/get-contact.js');
const { getContacts } = require('./routes/get-contacts.js');
const { postContacts } = require('./routes/post-contact.js');
const { getComments } = require('./routes/get-comments.js');
const { newUser } = require('./routes/new-user');
const { postComment } = require('./routes/post-comment.js');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});


app.get('/api/contacts/:contact_id', getContact());

// CONTACT ROUTES
// app.get('/contacts/:id', imported asynchronous function that takes in res and req);


// app.put('/contacts/:id', imported asynchronous function that takes in res and req);


app.post('/api/contacts', postContacts());


// app.delete('/contacts/:id', imported asynchronous function that takes in res and req);


// NEW-USER ROUTE
app.post('api/new-user', newUser());


// COMMENTS ROUTES
app.get('api/comments/:contact_id', getComments());


app.post('api/comments/:contact_id', postComment());


// app.delete('/comments/:contact_id', imported asynchronous function that takes in res and req);


// app.put('/comments/:contact_id', imported asynchronous function that takes in res and req);

app.get('/api/contacts', getContacts());

app.use(require('./middleware/error'));

module.exports = app;

