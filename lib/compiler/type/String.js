
module.exports = class _String
{
  constructor (content)
  {
    this.content = [];
    
    if (content) this.add(content);
  }
  
  add (val)
  {
    this.content.push(val);
  }
  
  run ()
  {
    
  }
  
  compile ()
  {
    return this;
  }
  
  toString ()
  {
    return "'" + this.content.join('') + "'";
  }
}