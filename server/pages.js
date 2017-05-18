const express = require('express');
const router = express.Router();
const fs = require('fs');
const markdown = require('markdown').markdown;

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
