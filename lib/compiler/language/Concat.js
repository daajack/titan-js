
module.exports = class Concat
{
  constructor (context)
  {
    this.context = context;
    this.content = [];
    this.isConcat = true;
  }
  
  add (content)
  {
    this.content.push(content);
  }
  
  toString ()
  {
    return this.content.join(this.context.php ? ' . ' : ' + ');
  }
}
