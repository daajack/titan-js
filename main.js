'use strict';

(function() {

  let Compiler = require('./lib/compiler/Compiler.js');
  let compiler = new Compiler();
  
  let fs = require('fs');
  let DOMParser = require('xmldom').DOMParser;

  fs.readFile('index.vml', 'utf8', function(err, data) {

    var document = new DOMParser().parseFromString(data, 'text/xml');
//    let data = '<html>hello world</html>';
    
  let result = compiler.prepare(document);
  console.log(result);
  });
})()

