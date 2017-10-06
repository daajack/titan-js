
const call = require('./Call.js');

module.exports = class Variable
{
  constructor (context, name)
  {
    this.context = context;
    this.name = name;
  }
  
  get (name)
  {
    return new Variable(this.context, this.name + (this.context.php ? '->' : '.') + name);
  }
  
  call (name, _arguments)
  {
    return this.context.call(this, name, _arguments);
  }
  
  toString ()
  {
    return this.context.php ? '$' + this.name : this.name;
  }
}