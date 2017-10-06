
module.exports = class Element
{
  constructor(document)
  {
    this.document = document;
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
  
  toString ()
  {
    return this.namespaceURI + ':' + this.localName;
  }
}