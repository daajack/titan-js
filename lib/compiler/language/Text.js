
module.exports = class Text
{
  constructor(context, content)
  {
    this.context = context;
    this.content = content;
    this.isStructure = true;
  }
  
//  compile (context)
//  {
//    return this.content;
//    return this.content.map(o => {  (typeof o === 'string' ? o : o.compile()); }).join('');
//  }
  toString ()
  {
    return this.content.join('');
  }
}