var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var PizzaSchema = new Schema({
  name: String,
  slices: Number
});

var Pizza = mongoose.model('Pizza', PizzaSchema);

module.exports = Pizza;
