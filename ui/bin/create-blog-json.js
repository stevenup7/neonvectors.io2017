const _       = require('lodash');
const fs      = require('fs');
const process = require('process');
var blogPath  = process.cwd() + '/src/html/content/blogs/';

console.log(blogPath);

var blogFileList = [];

new Promise(function (resolve, reject) {
  fs.readdir(blogPath, (err, files) => {
    files.forEach(file => {

      if ( file.indexOf('#') !== 0 && file !== 'blog-list.json') {
        blogFileList.push({
          fileName: file
        });
      }
    });
    resolve();
  });
}).then( function () {


  blogFileList = _.sortBy(blogFileList, 'fileName');


  blogFileList.forEach(function (f) {

    var contents = fs.readFileSync(blogPath + f.fileName, 'utf8');
    //console.log(contents);
    var lines = contents.split(/[\r\n]/gi);

    f.title = lines[0].replace('# ', '');
    var tags = lines[2];

    tags = tags.replace(/\] \[/gi, '|');
    tags = tags.replace(/\[/gi, '').replace(/\]/gi, '');
    tags = tags.split('|');
    f.tags = tags;

  });

  fs.writeFileSync(blogPath + 'blog-list.json', JSON.stringify(blogFileList, '  ', '  '));

});
