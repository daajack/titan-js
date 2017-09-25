
const _String = require('../type/String.js');

module.exports = class Call
{
  constructor(context, ref, _arguments = [])
  {
    if (!Array.isArray(_arguments)) throw new Error('Arguments must be in array');
    
    this.ref = ref;
    this.context = context;
    this.arguments = _arguments;
  }
  
  call (name, _arguments)
  {
    return this.context.call(this, name, _arguments);
  }
  
  toString ()
  {
    let _arguments = this.arguments.map(o => typeof o === 'string' ? new _String(o) : o);
    return this.ref + '(' + _arguments.join(', ') + ')';
  }
}