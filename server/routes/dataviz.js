const express = require('express');
const router = express.Router();
const fs = require('fs');

var sections = require('./sections');
router.get('/', function (req, res) {
  console.log('list');
  res.render('index.ejs', {
    title: 'neonvectors.io',
    sections: sections,
    bodyPartial: 'content/dataviz/dataviz.ejs',
    vizList: require('../data/viz/viz-list.json')
  });
});

router.get('/:id', function (req, res) {
  console.log('specific page');
  var vizPath =  '../data/viz/' + req.params.id;
  var defn = require(vizPath + '/viz.json');
  defn.id = req.params.id;
  res.render('index.ejs', {
    title: 'neonvectors.io',
    description: defn,
    vizData: defn,
    bodyPartial: 'content/dataviz/viz-wrapper.ejs',
    sections: sections,
    vizTemplate: '../../' +  vizPath + '/page-01.html'
  });
});

router.get('/:id/:page', function (req, res) {
  console.log('specific page wtih content ');
  var vizPath =  'data/viz/' + req.params.id  + '/' + req.params.page;
  fs.realpath(vizPath, function (e,d) {
    console.log('reeel path');
    console.log(e, d);
  });
  fs.readFile(vizPath, 'utf8', function (err, data)  {
    if (err) {
      console.log(err, data);
      res.send('err');
    } else {
      res.send(data);
    }
  });

});


module.exports = router;
