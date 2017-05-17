var express = require('express');

var app = express();

app.set('view engine', 'ejs');

app.use('/static', express.static('public'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var pages = require('./pages');

app.use('/pages', pages);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
