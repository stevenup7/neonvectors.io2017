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
      stevenBlogs: require('./views/content/blogs/blog-list.json')
    }
  });
});


router.get('/blogs/:id', function (req, res) {

  fs.readFile('./views/content/blogs/' + req.params.id, 'utf8', function (err, contents) {

    if (err) {
      res.send(err);
      throw (err);
    }

    console.log(contents);

    contents = contents.replace(/\[[(^\)]\]/, '[$1](http://test.com)');
    var htmlContent = markdown.toHTML(contents);

    htmlContent = htmlContent.replace('<h1>', '<h1 class="title is-3">');

    res.render('index.ejs', {
      title: 'neonvectors.io',
      sections: sections,
      bodyPartial: 'content/blog-post.ejs',
      content: htmlContent
    });


  });

});


module.exports = router;
