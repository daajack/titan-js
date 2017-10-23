
const Node = require('./Node.js');

module.exports = class Element extends Node
{
  constructor(document)
  {
    super(document);
    
    this.type = Node.ELEMENT;
  }
  
  getAttribute (name)
  {
    let result;
    let len = this.attributes.length;
    
    for (var key = 0; key < len; key++)
    {
      if (this.attributes[key].localName === name)
      {
        result = this.attributes[key];
        break;
      }
    }
    
    return result ? result.value : '';
  }

  read ()
  {
    if (this.children.length > 1 || this.children[0].type !== Node.TEXT)
    {
      throw new Error('Cannot read a complex element');
    }
    
    return this.children[0].value;
  }
  
  toString ()
  {
    return this.namespaceURI + ':' + this.localName;
  }
}