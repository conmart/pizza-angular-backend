var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/pizza-backend");

module.exports.Pizza = require("./pizza.js");
