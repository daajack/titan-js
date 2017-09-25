
module.exports = class Instruction
{
  constructor (context, content)
  {
    this.context = context;
    this.content = content;
    this.isStructure = true;
  }
  
  toString ()
  {
    return this.content + ';\n';
  }
}