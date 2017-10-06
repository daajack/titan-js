'use strict';

global.__base = __dirname + '/lib';

(function() {

  let Compiler = require('./lib/compiler/Compiler.js');
  let Document = require('./lib/dom/Document.js');
  let fs = require('fs');

  let compiler = new Compiler();

  fs.readFile('test/index.vml', 'utf8', function(err, datas)
  {
    let DOMParser = require('xmldom').DOMParser;
    
    let document = new Document(new DOMParser);
    document.parse(datas);
    
    compiler.prepare(document, 0, (result) => {
      result.map(w => {
        console.log('[[' + w.name + ']]');
        console.log(w.content);
      });
    });
  });
})()

