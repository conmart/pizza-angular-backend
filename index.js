var express = require('express'),
  bodyParser = require('body-parser');

var Pizza = require('controllers/pizza');

// generate a new express app and call it 'app'
var app = express();

// serve static files in public
app.use(express.static('public'));

// body parser config to accept our datatypes
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/pizzas', Pizza.index);
app.post('/api/pizzas', Pizza.create)

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening at http://localhost:3000/');
});
