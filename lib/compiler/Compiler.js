
const View = require('../view/compiler/View.js');
const Document = require('../dom/Document.js');

module.exports = class Compiler
{
  constructor (app)
  {
    this.app = app;
  }
  
  prepareDOM (path, datas, php, callback)
  {
    let file = this.app.fs.getFile(path);
    let document = new Document();
    document.loadDOM(datas);

    this.prepare(file, document, php).then( view => callback(view) ).catch( err => console.error(err) );
  }
  
  async prepare (file, document, php)
  {
    let view = new View(this, file);
    let fs = this.app.fs;
    
    view.name = 'root';
    
    async function prepareView(view)
    {
      view.prepare(document.documentElement);
      
      await view.prepareChildren();
      await view.compile(php);

      await Promise.all(Object.keys(view.views).map(async k => await prepareView(view.views[k]) ));
      
      var path = view.path;
      Object.values(view.windows).map(w => fs.scripts[path + '.' + w.name] = w.content);
      
      return view;
    }
    
    return await prepareView(view);
  }
}