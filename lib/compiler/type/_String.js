
module.exports = class _String
{
  constructor (context, content)
  {
    this.context = context;
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