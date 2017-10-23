
module.exports = class Attribute
{
  constructor(document)
  {
    this.type = 'attribute';
    this.document = document;
  }
  
  toString ()
  {
    return '@' + this.namespaceURI + ':' + this.localName;
  }
}