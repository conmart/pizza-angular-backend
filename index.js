var express = require('express'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  session = require("express-session"),
  db = require("./models"),
  User = db.User;

passport.use('local-signin', new LocalStrategy(
  function(username, password, done) {
    console.log("signing in")
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        console.log("signing in with bad user")
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        console.log("signing in with incorrect password")
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));;
passport.use('local-signup', new LocalStrategy({
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
        console.log("finding user yay")
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ username: username }, function(err, user) {
            console.log("found a user")
            // if there are any errors, return the error
            if (err) {
                console.log("error", err)
                return done(err);
              }

            // check to see if theres already a user with that email
            if (user) {
                console.log("username taken")
                return done(null, false, {message: 'That username is already taken.'} );
            } else {
                // if there is no user with that email
                // create the user
                console.log("creating user")
                var newUser            = new User();

                // set the user's local credentials
                newUser.username = username;
                newUser.password =    newUser.generateHash(password);

                // save the user
                newUser.save(function(err, savedUser) {
                  console.log("saved", savedUser)
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });

    }));


var Pizza = require('./controllers/pizza');

// generate a new express app and call it 'app'
var app = express();

var corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true,
}
app.use(cors(corsOptions));

// serve static files in public
app.use(express.static('public'));

// body parser config to accept our datatypes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(session({ secret: 'wow secrets' }));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

    // used to deserialize the user
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use(function(req, res, next) {
  console.log("got a request", req.method, req.url);
  if(req.method == "POST") {
    console.log("body is", req.body)
  }
  next();
})


app.options('*', cors(corsOptions))
app.get('/api/pizzas', Pizza.index);
app.post('/api/pizzas', Pizza.create);

app.post('/login', passport.authenticate('local-signin'), function(req, res) {
  console.log("did the login maybe? logged in user is", req.user)
  req.login(req.user, function(err) {
    res.json();
  })
});

app.post('/signup', passport.authenticate('local-signup'), function(req, res) {
  console.log("signed up yo")
  req.login(req.user, function(err) {
    res.json()
  })

})

app.get("/logout", function(req, res) {
  req.logout();
  res.json();
})


app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening at http://localhost:3000/');
});
