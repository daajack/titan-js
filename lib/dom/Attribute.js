
module.exports = class Attribute
{
  constructor(document)
  {
    this.document = document;
  }
  
  toString ()
  {
    return '@' + this.namespaceURI + ':' + this.localName;
  }
}