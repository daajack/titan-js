
const View = require('../view/compiler/View.js');
const Document = require('../dom/Document.js');

module.exports = class Compiler
{
  prepareDOM (datas, php, callback)
  {
    let document = new Document();
    document.loadDOM(datas);

    this.prepare(document, php, callback);
  }
  
  prepare (document, php, callback)
  {
    let view = new View();
    
    view.onReady = function()
    {
      let result = view.compile(php);
      callback(result);
    }

    view.prepare(document.documentElement);
  }
}