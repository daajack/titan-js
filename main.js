'use strict';

global.__base = __dirname + '/lib';

(function()
{
  let App = require('./lib/App.js');
  let titan = new App('test');
  let php = 0;
  titan.isBrowser = 0;
  
  titan.path = '..';
  
  async function build()
  {
    let Compiler = require('./lib/compiler/Compiler.js');
    let Document = require('./lib/dom/Document.js');

    let fs = titan.fs;
    let compiler = new Compiler(titan);

    let DOMParser = require('xmldom').DOMParser;
    let document = new Document(new DOMParser);

    var file = fs.getFile('test/index.vml');
    var datas = await file.read();
    document.parse(datas);

    return await compiler.prepare(file, document, php);
  }
  
  build().then( view => 
  {
    console.log(view.windows.tree.content);
    console.log('-----------');
    console.log(view.windows.main.content);
    console.log('-----------');
    
    if (!php && !titan.isBrowser)
    {
      console.log(titan.eval(view.windows.main.content));
    }
    else
    {
      console.log('No render in ' + (php ? 'php' : 'browser') + ' mode');
    }
  })
  .catch( err => console.error(err) );
  
  
})()
