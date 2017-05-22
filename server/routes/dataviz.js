const express = require('express');
const router = express.Router();

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
  res.render('index.ejs', {
    title: 'neonvectors.io',
    description: defn,
    vizData: defn,
    bodyPartial: 'content/dataviz/viz-wrapper.ejs',
    sections: sections,
    vizTemplate: '../../' +  vizPath + '/page-01.html'
  });
});


module.exports = router;
