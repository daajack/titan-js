
const Document = require('../../dom/Document.js');
const File = require('../../fs/File.js');
const Table = require('../../sql/Table.js');
const Query = require('../../sql/query/Select.js');
const Window = require('../../compiler/language/Window.js');
const Context = require('../../compiler/language/Context.js');

const Collection = require('../../sql/Collection.js');

module.exports = class Tree
{
  constructor (view)
  {
    this.view = view;
    this.elements = [];
  }
  
  async prepare (node)
  {
    let schema = node.getAttribute('schema');
    let tree = this;
    
    if (schema)
    {
      let fs = this.view.compiler.app.fs;
      
      var content = await fs.getFile(schema).read();

      if (!content)
      {
        throw new Error('No content found');
      }

      tree.prepareWindow(content, node);
    }
  }
  
  addElement (element)
  {
    this.query.addElement(element);
  }
  
  prepareWindow (content, node)
  {
    let window = new Window(this.view.compiler);
    let context = new Context(this.view.compiler, window);
    
    window.name = 'tree';
    window.context = context;

    let publicQuery = context.addVariable('Query', true);
    let dummy = context.addVariable('dummy');
    let app = context.addVariable('app');

    this.view.windows[window.name] = window;
    
    let document = new Document(node.document.parser);
    document.parse(content);
//        console.log(content);
    let table = new Table();
    table.parse(document.documentElement);
    
    let collection = new Collection();
    collection.table = table;
    
    context.use('sylma.storage.sql.runtime.Query');
    context.add(context.assign(dummy, context.instanciate(publicQuery, [app, context.string(table.name)])));
    
    this.ref = collection;
    this.query = new Query();
    this.query.dummy = dummy;
    this.context = context;
  }
  
  compile (php)
  {
    this.context.php = php;
    this.context.parent.php = php;
    
    this.query.compile(this.context);
  }
}