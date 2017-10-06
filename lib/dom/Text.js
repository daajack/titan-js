
module.exports = class Text
{
  constructor(document)
  {
    this.document = document;
  }
  
  toString ()
  {
    return '#text:' + this.nodeValue;
  }
}