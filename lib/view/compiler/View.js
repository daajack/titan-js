
const Tree = require('./Tree.js');
const Template = require('./Template.js');
const Context = require('../../compiler/language/Context.js');
const Window = require('../../compiler/language/Window.js');
const _Class = require('../../compiler/language/_Class.js');

module.exports = class View
{
  constructor ()
  {
    this.templates = [];
    this.windows = [];
    this.awaited = 0;
  }
  
  prepare (element)
  {
    if (!element.children)
    {
      throw new Error('Root must have children');
    }

    this.children = element.children.map(item => this.parseChild(item));
    this.children = this.children.filter(i => i);
    
    if (!this.awaited)
    {
      this.onReady();
    }
  }
  
  lookupTemplate (element, mode)
  {
    let templates = this.templates.filter(t => {
      
      t.weight = 0;
      
      if (t.mode !== mode)
      {
        return false;
      }
      
      if (t.match === '*')
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
    console.log('view ready to compile');
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
  
  compile (php)
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
    
    context.add(this.templates[0].compile(this.tree.ref, context));
    
    this.tree.compile(php);
    
//console.log(context.content);
    this.windows.forEach(w => w.content = w.render());
    return this.windows;
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
            
          case 'template' :

            result = new Template(this);
            result.prepare(node);
            
            this.templates.push(result);
            
            break;

          default : throw new Error(`Unknown element name : ${node.nodeName}`);
        }
        break;
        
      default : throw new Error(`Unknown element namespace : ${node.nodeName}`);
    }
    
    return result;
  }
}