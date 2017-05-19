var express = require('express');

var app = express();

// use ejs for templates
app.set('view engine', 'ejs');
// todo: nginx to serve this
app.use('/static', express.static('public'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var blogs = require('./routes/blogs');
var dataviz = require('./routes/dataviz');
app.use('/dataviz', dataviz);
app.use('/blog', blogs);

app.get('/about', function (req, res) {
  var sections = require('./routes/sections');
  res.render('index.ejs', {
    title: 'neonvectors.io',
    sections: sections,
    bodyPartial: 'content/about.ejs'
  });
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
