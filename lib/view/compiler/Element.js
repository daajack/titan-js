
module.exports = class Element
{
  constructor (template)
  {
    this.template = template;
  }
  
  prepare (node)
  {
//    console.log(`prepare element : ${node.nodeName}`);
    this.name = node.localName;
    this.namespace = node.namespaceURI;
    this.prefix = node.prefix;
    this.children = this.template.parseChildren(node.childNodes);
    this.attributes = {};
    
    if (node.attributes)
    {
      let len = node.attributes.length;
      
      for (var i = 0; i < len; i++) 
      {
        var attribute = node.attributes[i];
        this.attributes[attribute.nodeName] = attribute.nodeValue
      }
    }
  }
  
  run (parentElement)
  {
    let element = window.document.createElement(this.getName());
    
    this.children.forEach(child => element.insertChild(child.run()));
    parentElement.insertChild(element);
  }
  
  compile (context, template)
  {
    let content = [];
    let name = this.getName();
    
    content.push('<' + name);
    
    let attributes = Object.keys(this.attributes).map(key => [key, this.attributes[key]]);
    attributes.forEach(attr => content.push(' ', attr[0], '="', this.compileAttribute(attr[1]), '"'));
    
    let children = this.children.map(child => typeof child === 'string' ? child : child.compile(context, template));
//console.log(children);
    if (children.length)
    {
      content.push('>');
      content.push.apply(content, children);
      content.push('</' + name + '>');
    }
    else
    {
      content.push('/>');
    }
    
    return content;
  }
  
  compileAttribute(value)
  {
    return value;
  }
  
  getName ()
  {
    return (this.prefix ? this.prefix + ':' : '') + this.name;
  }
}