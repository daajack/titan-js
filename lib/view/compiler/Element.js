
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
    this.children = this.template.parseChildren(node.children);
    this.attributes = {};
    
    node.attributes.forEach(attribute => this.attributes[attribute.name] = attribute.value);
  }
  
  run (parentElement)
  {
    let element = window.document.createElement(this.getName());
    
    this.children.forEach(child => element.insertChild(child.run()));
    parentElement.insertChild(element);
  }
  
  async compile (context, tree, template)
  {
    let content = [];
    let name = this.getName();
    
    content.push('<' + name);
    
    let attributes = Object.keys(this.attributes).map(key => [key, this.attributes[key]]);
    attributes.forEach(attr => content.push(' ', attr[0], '="', this.compileAttribute(attr[1]), '"'));
    
    let children = await Promise.all(this.children.map(async child => typeof child === 'string' ? child : await child.compile(context, tree, template)));
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