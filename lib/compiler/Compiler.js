
const View = require('../view/compiler/View.js');
const Document = require('../dom/Document.js');

module.exports = class Compiler
{
  constructor (app)
  {
    this.app = app;
  }
  
  prepareDOM (datas, php, callback)
  {
    let document = new Document();
    document.loadDOM(datas);

    this.prepare(document, php, callback);
  }
  
  prepare (document, php, callback)
  {
    let view = new View(this);
    
    view.name = 'root';
    
    async function prepareView(view)
    {
      view.prepare(document.documentElement);
      
      await view.prepareChildren();
      view.compile(php, function(result)
      {
        callback(view, result);
      });

      await Promise.all(Object.keys(view.views).map(async k => await prepareView(view.views[k]) ));
    }
    
      prepareView(view).catch(err => console.error(err));
  }
}