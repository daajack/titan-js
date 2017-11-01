'use strict';

global.__base = __dirname + '/lib';

(function() {

  let App = require('./lib/App.js');
  let titan = new App('test');
  
  let Compiler = require('./lib/compiler/Compiler.js');
  let Document = require('./lib/dom/Document.js');
  
  let fs = titan.fs;

  let compiler = new Compiler(titan);
  
  fs.getFile('test/index.vml').read().then(function(datas)
  {
    let DOMParser = require('xmldom').DOMParser;
    
    let document = new Document(new DOMParser);
    document.parse(datas);
    
//    let views = [];
    
    compiler.prepare(document, 0, (view, result) => {
//      views.push.apply(view.views);
      result.map(w => {
        console.log('+++' + view.name + '+++');
        console.log('[[' + w.name + ']]');
        console.log(w.content);
      });
    });
  }).catch(e => { throw new Error('Promise error : ' + e) });
})()
