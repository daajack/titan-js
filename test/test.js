
var assert = require('assert');

describe('Template', function() 
{
  describe('simplest', function() 
  {
    it('should return simple element', async () =>
    {
      let App = require('../lib/App.js');
      let titan = new App('test');
      titan.path = '..';

      let Compiler = require('../lib/compiler/Compiler.js');
      let Document = require('../lib/dom/Document.js');

      let fs = titan.fs;

      let compiler = new Compiler(titan);

      let file = fs.getFile('test/index.vml');
      let datas = await file.read()
      let DOMParser = require('xmldom').DOMParser;

      let document = new Document(new DOMParser);
      document.parse(datas);

      let view = await compiler.prepare(file, document);
      let content = titan.eval(view.windows.main.content);

      assert.equal(content, '<ul><li>Franck</li><li>Aretha</li></ul>');
    })
  });
});

