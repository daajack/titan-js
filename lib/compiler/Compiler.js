
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
    
    view.name = 'root';
    
    function prepare(view)
    {
      view.onReady = function()
      {
        view.compile(php, function(result)
        {
          callback(view, result);
        });
        
        Object.keys(view.views).map(k => 
        {
          prepare(view.views[k])
          view.views[k].prepareChildren();
        });
      }
    }
    
    prepare(view);

    view.prepare(document.documentElement);
    view.prepareChildren();
  }
}