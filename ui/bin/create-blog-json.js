const _       = require('lodash');
const fs      = require('fs');
const process = require('process');

var blogPath  = process.cwd() + '/src/html/content/blogs/';
var blogOutputPath  = process.cwd() + '/src/html/content/blogs/.blogoutput/';
var BlogFile = require('./BlogFile');

// get a list of all the blog files
new Promise(function (resolve, reject) {
  var blogFileList = [];
  fs.readdir(blogPath, (err, files) => {
    files.forEach(file => {
      if ( file.indexOf('#') !== 0 &&
           file !== 'blog-list.json' &&
           file !== 'blog-tags.json'
         ) {
        blogFileList.push(file);
      }
    });
    resolve(blogFileList);
  });
}).then( function (blogFileList) {

  try {
    fs.mkdirSync(blogOutputPath, 0766);
  } catch (e) {
    console.log(e);
    // igonore exists already
  }
  // sort the files
  blogFileList = _.sortBy(blogFileList, 'fileName');

  // keep a running list of all tags and blogs
  var tags = {};
  var blogs = [];
  // loop over files and make json blog posts out of them
  blogFileList.forEach(function (f) {
    var b = new BlogFile (f, blogPath);
    blogs.push(b);
    _.each (b.tags, function (tag) {
      if (!tags.hasOwnProperty(tag)) {
        tags[tag] = [];
      }
      tags[tag].push({
        fileName: b.fileName,
        title: b.title
      });
    });

    var blogJSONFile = JSON.stringify(b.toJSONFull() , '  ', '  ');
    fs.writeFileSync(blogOutputPath + b.fileName + '.json', blogJSONFile);
  });

  var blogDetailsFile = JSON.stringify(blogs, '  ', '  ');
  fs.writeFileSync(blogOutputPath + 'blog-list.json', blogDetailsFile);

  var blogTagsFile = JSON.stringify(tags, '  ', '  ');
  fs.writeFileSync(blogOutputPath + 'blog-tags.json', blogTagsFile);

});
