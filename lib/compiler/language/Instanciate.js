
module.exports = class Instanciate
{
  constructor(context, ref, _arguments = [])
  {
    this.context = context;
    this.ref = ref;
    
    if (!Array.isArray(_arguments))
    {
      throw new Error('Arguments must be sent in array');
    }
    
    this.arguments = _arguments;
  }
  
  toString ()
  {
    return 'new ' + this.ref + '(' + this.arguments.join(', ') + ')';
  }
}