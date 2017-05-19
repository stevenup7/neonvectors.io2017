const express = require('express');
const router = express.Router();

var sections = require('./sections');

router.get('/', function (req, res) {
  res.render('index.ejs', {
    title: 'neonvectors.io',
    sections: sections,
    bodyPartial: 'content/dataviz/dataviz.ejs',
    content: 'test'
  });
});


module.exports = router;
