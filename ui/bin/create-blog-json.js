const _       = require('lodash');
const fs      = require('fs');
const process = require('process');
var blogPath  = process.cwd() + '/src/html/content/blogs/';


class BlogFile {

  constructor (fileName) {
    this.fileName = fileName;
    this.parseRawFile();

  }

  parseRawFile () {
    console.log(this.fileName);
    var contents = fs.readFileSync(blogPath + this.fileName, 'utf8');

    var lines = contents.split(/[\r\n]/gi);
    this.title = lines[0].replace('# ', '');

    var tags = lines[2];

    if (tags.indexOf('[') === -1) {
      throw ('no tags on line 2 of blog ' + this.fileName);
    }
    tags = tags.replace(/\] \[/gi, '|');
    tags = tags.replace(/\[/gi, '').replace(/\]/gi, '');
    tags = tags.split('|');
    this.tags = tags;

  }

  toJSON () {
    return {
      fileName: this.fileName,
      title: this.title,
      tags: this.tags
    };
  }

};


// get a list of all the blog files
new Promise(function (resolve, reject) {
  var blogFileList = [];
  fs.readdir(blogPath, (err, files) => {
    files.forEach(file => {
      if ( file.indexOf('#') !== 0 && file !== 'blog-list.json') {
        blogFileList.push(file);
      }
    });
    resolve(blogFileList);
  });
}).then( function (blogFileList) {
  // sort the files
  blogFileList = _.sortBy(blogFileList, 'fileName');
  var tags = {};
  var blogs = [];
  // loop over files and make json blog posts out of them
  blogFileList.forEach(function (f) {
    console.log(f);
    var b = new BlogFile (f);
    blogs.push(b);

    _.each (b.tags, function (tag) {
      if (!tags.hasOwnProperty(tag)) {
        tags[tag] = [];
      }
      tags[tag].push(b.fileName);
    });

  });
  var blogDetailsFile = JSON.stringify(blogs, '  ', '  ');
  console.log(blogDetailsFile);
  fs.writeFileSync(blogPath + 'blog-list.json', blogDetailsFile);

  var blogTagsFile = JSON.stringify(tags, '  ', '  ');
  console.log(blogTagsFile);
  fs.writeFileSync(blogPath + 'blog-tags.json', blogTagsFile);


});
