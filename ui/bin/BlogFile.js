const fs = require('fs');

class BlogFile {

  constructor (fileName, filePath) {
    this.fileName = fileName;
    this.filePath = filePath;
    this.parseRawFile();
  }

  parseRawFile () {
    var contents = fs.readFileSync(this.filePath + this.fileName, 'utf8');

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

    this.content = lines.slice(4).join('\r\n');
  }

  toJSONFull () {
    return {
      fileName: this.fileName,
      title: this.title,
      tags: this.tags,
      content: this.content
    };
  }

  toJSON () {
    return {
      fileName: this.fileName,
      title: this.title,
      tags: this.tags
    };
  }


};

module.exports = BlogFile;
