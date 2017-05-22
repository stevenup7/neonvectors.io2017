const fs      = require('fs');
const process = require('process');

var vizPath  = process.cwd() + '/src/viz/';

// get a list of all the blog files
new Promise(function (resolve, reject) {
  var vizList = [];

  fs.readdir(vizPath, (err, files) => {
    files.forEach(file => {
      if ( file.indexOf('#') !== 0) {
        vizList.push(file);
      }
    });
    resolve(vizList);
  });
}).then( function (vizList) {

  var vizJSONFile = JSON.stringify(vizList, '  ', '  ');
  fs.writeFileSync(vizPath + 'viz-list.json', vizJSONFile);


  console.log('vizlist', vizList);
});
