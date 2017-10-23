
const Tree = require('./Tree.js');
const Template = require('./Template.js');
const Import = require('./Import.js');

const Context = require('../../compiler/language/Context.js');
const Window = require('../../compiler/language/Window.js');
const _Class = require('../../compiler/language/_Class.js');

module.exports = class View
{
  constructor ()
  {
    this.children = [];
    this.templates = [];
    this.windows = [];
    this.views = {};
    
    this.name = 'default';
    this.tree = null;
    this.awaited = 0;
  }
  
  prepare (element)
  {
    this.element = element;
  }
  
  prepareChildren()
  {
    let element = this.element;
    
    if (!element.children)
    {
      throw new Error('Root must have children');
    }

    this.children = this.parseChildren(element.children);
    this.children = this.children.filter(i => i);
    
    if (element.getAttribute('extends'))
    {
      
    }
    
    if (!this.awaited)
    {
      this.onReady();
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
  
  onReady ()
  {
    throw new Error('No callback defined on view');
  }
  
  addWait ()
  {
    this.awaited++;
  }
  
  removeWait ()
  {
    this.awaited--;
    
    if (!this.awaited)
    {
      this.onReady();
    }
  }
  
  run ()
  {
    
  }
  
  compile (php, callback)
  {
    let window = new Window(php);
    let context = new Context(window, php);
    
    window.context = context;
    window.name = 'main';
    
    this.windows.push(window);
    
    let view = context.addVariable('View', true);
    let dummy = context.addVariable('dummy');
    let scripts = context.addVariable('scripts');
    let tree = context.addVariable('tree');
    
    context.use('sylma.view.runtime.View');
    
    context.view = this;
    context.tree = tree;
    
    context.add(context.assign(dummy, context.instanciate(view, [scripts])));
    
    if (php)
    {
      context.add(context.assign(tree, dummy.call('call', ['tree'])));
    }
    
    let root = this.lookupTemplate(null, '', true);
    
    if (!root)
    {
      throw new Error('Cannot find root template');
    }
    
    root.compile(this.tree.ref, context, (result) => 
    {
      context.add(result)
      this.tree.compile(php);
      
      this.windows.forEach(w => w.content = w.render());
      callback(this.windows);
    });
    
//console.log(context.content);
  }
  
  parseChildren (children)
  {
    return children.map(item => this.parseChild(item));
  }
  
  /**
   * 
   * @param {type} Element
   * @returns {undefined}
   */
  parseChild(node)
  {
//console.log(node);
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
            result.prepare(node);
            
            this.tree = result;
            
            break;
            
          case 'import' :

            result = new Import(this);
            result.prepare(node);
            
            break;
            
          case 'template' :

            result = new Template(this);
            result.prepare(node);
            
            this.templates.push(result);
            
            break;
            
          case 'view' :

            result = new View(this);
            result.prepare(node);
            
            if (this.views[result.name])
            {
              throw new Error('One or more view share the same name : ' + result.name);
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