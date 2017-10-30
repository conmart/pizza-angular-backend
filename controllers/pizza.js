var db = require('../models');

function index(req, res) {

  console.log("session is", req.session)
  console.log("user is", req.session.passport && req.session.passport.user)
  console.log("authentication status is", req.isAuthenticated())
  if (!req.isAuthenticated()) {
    res.status(403).send("Please log in before fetching pizzas.")
  } else {
    db.Pizza.find({}, function(err, foundPizzas) {
      if (err) {
        console.log("error");
        res.status(400).send(err);
      } else {
        res.send(foundPizzas);
      }
    })
  }
}

function create(req, res) {
  db.Pizza.create(req.body, function(err, savedPizza){
    if (err) {
      console.log("error");
      res.status(400).send(err);
    } else {
      res.send(savedPizza);
    }
  })
}

module.exports.index = index;
module.exports.create = create;
