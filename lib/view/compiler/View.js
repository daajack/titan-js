
const Tree = require('./Tree.js');
const Template = require('./Template.js');

module.exports = class View
{
  constructor ()
  {
    this.templates = [];
  }
  
  prepare (element)
  {
    if (!element.childNodes)
    {
      throw new Error('Root must have children');
    }

    this.children = Object.keys(element.childNodes).map(item => this.parseChild(element.childNodes[item]));
    this.children = this.children.filter(i => i);
  }
  
  lookupTemplate (mode)
  {
    return this.templates.filter(t => t.mode === mode);
  }
  
  run ()
  {
    
  }
  
  compile (context)
  {
    let view = context.addVariable('View');
    let dummy = context.addVariable('dummy');
    let tree = context.addVariable('tree');
    
    context.tree = tree;
    
    context.add(context.text('(function(tree) {\n'));
    context.add(context.assign(dummy, context.instanciate(view)));
    context.add(this.templates[0].compile(context));
    
    context.add(context.text('return ' + dummy + '; })(tree)'));
//console.log(context.content);
    return context.render();
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

            result = new Tree();
            result.prepare(node);
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