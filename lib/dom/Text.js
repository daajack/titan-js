
const Node = require('./Node.js');

module.exports = class Text extends Node
{
  constructor(document, value)
  {
    super(document);
    
    this.type = Node.TEXT;
    this.value = value;
  }
  
  toString ()
  {
    return '#text:' + this.nodeValue;
  }
}