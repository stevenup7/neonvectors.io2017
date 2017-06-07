const express = require('express');
const router = express.Router();
const fs = require('fs');
const markdown = require('markdown').markdown;
const _ = require('lodash');

var sections = require('./sections');

router.get('/', function (req, res) {
  res.render('index.ejs', {
    title: 'neonvectors.io',
    sections: sections,
    bodyPartial: 'content/blogs.ejs',
    blogs: {
      conorBlogs: [],
      stevenBlogs: require('../data/blog/blog-list.json')
    }
  });
});

router.get('/tags/:tag', function (req, res) {
  var tagHash = require('../data/blog/blog-tags.json');
  var tagList = [];
  _.forEach(tagHash, function (v, k) {
    tagList.push({
      tag: k,
      current: k == req.params.tag,
      posts: v.sort()
    });
  });

  tagList = tagList.sort( function (a, b) {
    var ret = 0;
    // sort current selected to the top
    if (a.current) {
      ret = -1;
    } else if (b.current) {
      ret = 1;
    } else {
      if (a.tag < b.tag) {
        ret = -1;
      } else {
        ret = 1;
      }
    }
    return ret;
  });

  res.render('index.ejs', {
    title: 'neonvectors.io',
    sections: sections,
    bodyPartial: 'content/blog-tags.ejs',
    selectedTag: req.params.tag,
    tagList: tagList
  });
});



router.get('/tags.json', function (req, res) {
  res.json(require('../data/blog/blog-tags.json'));
});


router.get('/:id', function (req, res) {
  var blog = require('../data/blog/' + req.params.id + '.json');
  console.log(blog);

  res.render('index.ejs', {
    title: 'neonvectors.io',
    sections: sections,
    bodyPartial: 'content/blog-post.ejs',
    content: blog
  });

});


module.exports = router;
