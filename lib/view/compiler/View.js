
const Tree = require('./Tree.js');
const Template = require('./Template.js');
const Import = require('./Import.js');

const Context = require('../../compiler/language/Context.js');
const Window = require('../../compiler/language/Window.js');
const _Class = require('../../compiler/language/_Class.js');

module.exports = class View
{
  constructor (compiler, file)
  {
    this.compiler = compiler;
    this.children = [];
    this.templates = [];
    this.windows = {};
    this.views = {};
    this.file = file;
    
    this.name = 'default';
    this.tree = null;
    this.awaited = 0;
  }
  
  get path()
  {
    return this.file.path;
  }
  
  prepare (element)
  {
    this.element = element;
    this.name = element.getAttribute('name');
  }
  
  async prepareChildren()
  {
    let element = this.element;
    
    if (!element.children)
    {
      throw new Error('Root must have children');
    }

    this.children = await this.parseChildren(element.children);
    this.children = this.children.filter(i => i);
    
    if (element.getAttribute('extends'))
    {
      
    }
  }
  
  lookupTemplate (element, mode, root)
  {
    let templates = this.templates.filter(t => {
      
      t.weight = 0;
      
      if (t.mode !== mode)
      {
        return false;
      }
      
      if (!t.match && root)
      {
        t.weight = 2;
      }
      else if (t.match === '*')
      {
        t.weight = 1;
      }
      
      return t.weight;
    });
    
    templates.sort((a, b) => a.weight < b.weight);
    
    return templates.length ? templates[0] : null;
  }
  
  async compile (php)
  {
    let window = new Window(this.compiler, php);
    let context = new Context(this.compiler, window, php);
    
    window.context = context;
    window.name = 'main';
    
    this.windows[window.name] = window;
    
    window = this.windows.tree;
    window.name = '_query';
    
    this.windows[window.name] = window;
    
    let view = context.addVariable('View', true);
    let dummy = context.addVariable('dummy');
    let treeDummy = context.addVariable('tree');
    let app = context.addVariable('app');
    
    context.use('sylma.view.runtime.View');
    
    context.view = this;
    context.tree = treeDummy;

    context.add(context.assign(dummy, context.instanciate(view, [app])));
    
    let path = this.path + '.' + this.windows.tree.name;
    context.add(context.assign(treeDummy, dummy.call('call', [path])));
    
//    if (php)
//    {
//      context.add(context.assign(tree, dummy.call('call', ['tree'])));
//    }
    
    let root = this.lookupTemplate(null, '', true);
    
    if (!root)
    {
      throw new Error('Cannot find root template');
    }
    
    var result = await root.compile(this.tree.ref, context)
    context.add(result);

    this.tree.compile(php);
    
    function prepareWindows()
    {
      let _classView = this._classView || this.compiler.app.path + '/public/View.js';
      let _classQuery = this._classQuery || this.compiler.app.path + '/public/Query.js';

      let tree = this.windows.tree;
      let main = this.windows.main;
      let browser = this.compiler.app.isBrowser;
      
      let initTitan = "$app = \Sylma::getManager('titan');\n";
      
      tree.content = [
        php ? initTitan :
          ( browser ? 
          'let Query = window.titan.Query;\n' :
          'let Query = require(\'' + _classQuery + '\');\n'
          ),
        tree.render(),
      ].join('');
      
      main.content = [
        php ? initTitan : ( browser ? 
          'let View = window.titan.View;\n' :
          'let View = require(\'' + _classView + '\');\n'
        ),
        main.render(),
      ].join('');
    }
    
    prepareWindows.call(this);
  }
  
  async parseChildren (children)
  {
    return await Promise.all(children.map(async item => await this.parseChild(item) ));
  }
  
  /**
   * 
   * @param {type} Element
   * @returns {undefined}
   */
  async parseChild(node)
  {
    if (!node.nodeName || node.nodeName === '#text')
    {
      return;
      throw new Error('Child must be an element');
    }
    
    let result;
    
    switch (node.namespaceURI)
    {
      case 'http://2017.sylma.org/view' :
        
        switch (node.localName)
        {
          case 'tree' :

            result = new Tree(this);
            await result.prepare(node);
            
            this.tree = result;
            
            break;
            
          case 'import' :

            result = new Import(this);
            await result.prepare(node);
            
            break;
            
          case 'template' :

            result = new Template(this);
            result.prepare(node);
            await result.prepareChildren();
            
            this.templates.push(result);
            
            break;
            
          case 'view' :

            result = new View(this.compiler);
            result.prepare(node);
            
            if (this.views[result.name])
            {
              throw new Error('One or more views share the same name : ' + result.name);
            }
            
            this.views[result.name] = result;
            
            break;

          default : throw new Error(`Unknown element name : ${node.nodeName}`);
        }
        break;
        
      default : throw new Error(`Unknown element namespace : ${node.nodeName}`);
    }
    
    return result;
  }
}