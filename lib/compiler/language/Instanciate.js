
module.exports = class Instanciate
{
  constructor(context, ref, _arguments = [])
  {
    this.context = context;
    this.ref = ref;
    this.arguments = _arguments;
  }
  
  toString ()
  {
    return 'new ' + this.ref + '(' + this.arguments.join(', ') + ')';
  }
}