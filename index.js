var express = require('express'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  session = require("express-session");

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));;

var Pizza = require('./controllers/pizza');

// generate a new express app and call it 'app'
var app = express();
app.use(cors());

// serve static files in public
app.use(express.static('public'));

// body parser config to accept our datatypes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'wow secrets' }));
app.use(passport.initialize());
app.use(passport.session());

app.options('*', cors())
app.get('/api/pizzas', Pizza.index);
app.post('/api/pizzas', Pizza.create);

app.post('/login', passport.authenticate('local'), function(req, res) {
  console.log("did the login maybe?")
  res.json()
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening at http://localhost:3000/');
});
