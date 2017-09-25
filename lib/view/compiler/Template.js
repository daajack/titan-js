
const Element = require('./Element.js');
const _String = require('../../compiler/type/String.js');
const Concat = require('../../compiler/language/Concat.js');

module.exports = class Template
{
  constructor (view)
  {
    this.NS_HTML = 'http://2017.sylma.org/html';
    this.NS_TEMPLATE = 'http://2017.sylma.org/view';
    
    this.view = view;
    this.components = {}
  }
  
  prepare (node)
  {
    this.children = this.parseChildren(node.childNodes);
    this.mode = node.getAttribute('mode');
  }
  
  compile (context)
  {
    let content = this.children.map(child => child.compile(context, this));

    
//    content = content.reduce((a, b) => (['string', 'number'].indexOf(typeof a) !== -1 && ['string', 'number'].indexOf(typeof b) !== -1) ? a + b : b);
//    console.log(content);
//    content = content.map(r => typeof r === 'string' ? new _String(r) : r);
//result.map(item => {if (!item.compile) console.log(item[0])});
//    return result.join(' + ');
    
    return this.compileContent(context, content);
  }
  
  compileContent (context, content)
  {
    function flatten(arr) {
      return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
      }, []);
    }
    
    content = flatten(content);
    content = content.filter(i => i);

    let tree1 = [];
    let k = 0;
    let current = -1;
    let len = content.length;
    let isString = false;

    while (k < len)
    {
      let val = content[k];
      
      let wasString = isString;
      let type = typeof val;
      isString = type === 'string' || type === 'number';
      
      if (val === undefined || val === null)
      {
        throw new Error('Cannot set null value');
      }
      
      if (isString)
      {
        if (!wasString) tree1[++current] = new _String();
        tree1[current].add(val);
      }
      else
      {
        tree1[++current] = val;
      }
      
      k++;
    }
    
    let tree2 = [];
    k = 0;
    current = 0;
    len = tree1.length;
    isString = false;

    while (k < len)
    {
      let val = tree1[k];
      
      let wasString = isString;
      isString = !val.isStructure;
      
      if (isString)
      {
        if (!wasString) tree2[++current] = new Concat(context);
        tree2[current].add(val);
      }
      else
      {
        tree2[++current] = val;
      }
      
      k++;
    }
    
    let dummy = context.getVariable('dummy');
    
    return tree2.map(o => o.isConcat ? context.instruct(dummy.call('add', [o])) : o).join('');
  }
  
  parseChildren (content)
  {
    if (!content)
    {
      return [];
    }
    
    let template = this;
    let len = content.length;
    let children = [];
    
    for (var i = 0; i < len; i++)
    {
      children.push(content[i]);
    }
    
    return children.map(child => 
    {
      if (child.nodeName === '#text')
      {
        let val = child.nodeValue.trim();
//        return val ? new _String(val) : val;
        return val;
      }
      else if (child.data)
      {
        return null;
      }
//console.log(Object.keys(child));
      switch (child.namespaceURI)
      {
        case template.NS_HTML :

          var element = new Element(template);
          element.prepare(child);

          return element;

        case template.NS_TEMPLATE :
          
          let _class;
          
          switch (child.localName)
          {
            case 'apply' : _class = require('./Apply.js'); break;
            case 'read' : _class = require('./Read.js'); break;
            default : throw new Error('Unknown element');
          }
//          
//          let name = child.localName;
//          let file = name.charAt(0).toUpperCase() + name.slice(1);
//          let _class = require(`./template/${file}.js`);
          
          let component = new _class();
          component.prepare(child);
          
          return component;
          
        default :
          
          throw new Error('Unknown namespace in ' + child);
      }
    }).filter(i => i);
  }
}