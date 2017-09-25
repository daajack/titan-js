
module.exports = class Assignment
{
  constructor(context, to, from, op, declare = true)
  {
    this.context = context;
    this.to = to;
    this.from = from;
    this.op = op;
    this.declare = declare;
  }
  
  toString ()
  {
    return (this.declare ? 'let ' : '') + this.to + ' ' + this.op + ' ' + this.from;
  }
}