const express = require('express');
const cors = require('cors');
// const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

const { getContact } = require('./routes/get-contact.js');
const { getContacts } = require('./routes/get-contacts.js');
const { postContact } = require('./routes/post-contact.js');
const { putContact } = require('./routes/put-contact.js');

const { getComments } = require('./routes/get-comments.js');



const { postComment } = require('./routes/post-comment.js');
const { deleteComment } = require('./routes/delete-comment.js');

const { getCalendarEvents } = require('./routes/get-calendar.js');
const { postCalendarEvent } = require('./routes/post-calendar.js');
const { putCalendarEvent } = require('./routes/put-calendar.js');
const { deleteCalendarEvent } = require('./routes/delete-calendar.js');
const { getContactCalendar } = require('./routes/get-contact-calendar.js');
const { updateContactCalendar } = require('./routes/put-contact-calendar.js');
const { newUser } = require('./routes/new-user');
const { deleteContact } = require('./routes/delete-contact.js');


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



// CONTACT ROUTES
// ✔ tested
app.get('/api/contacts/:contact_id', getContact());
// ✔ tested
app.put('/api/contacts/:contact_id', putContact());
// ✔ tested
app.post('/api/contacts', postContact());
// ✔ tested
app.delete('/api/contacts/:contact_id', deleteContact());
// ✔ tested
app.get('/api/contacts', getContacts());


// NEW-USER ROUTE
app.post('/api/new-user', newUser);


// COMMENTS ROUTES
// ✔ tested
app.get('/api/comments/:contact_id', getComments());
// ✔ tested
app.post('/api/comments/:contact_id', postComment());
// ✔ tested
app.delete('/api/comments/:comment_id', deleteComment());

// app.put('/comments/:contact_id', imported asynchronous function that takes in res and req);


// GOOGLE CALENDAR API ROUTES

app.get('/api/calendar/:event_id', getCalendarEvents());

app.post('/api/calendar', postCalendarEvent());

app.put('/api/calendar/:event_id', putCalendarEvent);

app.delete('/api/calendar/:event_id', deleteCalendarEvent);

app.get('/api/contact/calendar/:contact_id', getContactCalendar);

app.put('/api/contact/calendar/:contact_id', updateContactCalendar);

app.use(require('./middleware/error'));

module.exports = app;