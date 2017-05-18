const express = require('express');
const router = express.Router();
const fs = require('fs');
const markdown = require('markdown').markdown;
const _ = require('lodash');

var sections = [
  {
    route: '/pages/blogs',
    title: 'Blogs'
  },
  {
    route: '/dataviz',
    title: 'Data Vizualizations'
  },
  {
    route: '/pages/about',
    title: 'About'
  }
];

router.get('/about', function (req, res) {
  res.render('index.ejs', {
    title: 'neonvectors.io',
    sections: sections,
    bodyPartial: 'content/about.ejs'
  });
});

router.get('/blogs', function (req, res) {
  res.render('index.ejs', {
    title: 'neonvectors.io',
    sections: sections,
    bodyPartial: 'content/blogs.ejs',
    blogs: {
      conorBlogs: [],
      stevenBlogs: require('./data/blogs/blog-list.json')
    }
  });
});

router.get('/blogs/tags/:tag', function (req, res) {
  var tagHash = require('./data/blogs/blog-tags.json');
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



router.get('/blogs/tags.json', function (req, res) {
  res.json(require('./data/blogs/blog-tags.json'));
});


router.get('/blogs/:id', function (req, res) {

  var blog = require('./data/blogs/' + req.params.id + '.json');
  console.log(blog);


  res.render('index.ejs', {
    title: 'neonvectors.io',
    sections: sections,
    bodyPartial: 'content/blog-post.ejs',
    content: blog
  });

});


module.exports = router;
