
const Variable = require('./Variable.js');
const _Class = require('./_Class.js');
const Instanciate = require('./Instanciate.js');
const Assignment = require('./Assignment.js');
const Call = require('./Call.js');
const Instruction = require('./Instruction.js');
const Loop = require('./Loop.js');
const Concat = require('./Concat.js');
const _String = require('../type/_String.js');
const Text = require('./Text.js');
const Use = require('./Use.js');

module.exports = class Context
{
  constructor (parent, php)
  {
    this.variables = {};
    this.content = [];
    this.parent = parent;
    this.php = php;
  }
  
  addVariable (name, _class)
  {
    name = name || 'var' + this.variables.length;
    
    let variable = _class ? new _Class(this, name) : new Variable(this, name)
    this.variables[name] = variable;
    
    return variable;
  }
  
  getVariable (name)
  {
    let result = this.variables[name];
    
    if (!result && this.parent)
    {
      result = this.parent.getVariable(name);
    }
    
    return result;
  }
/*
  parse (content)
  {
    switch (typeof content)
    {
      case 'string' : return new _String(this, content);
      default : throw new Error('Cannot convert value');
    }
  }
*/
  context ()
  {
    return new Context(this, this.php);
  }
  
  call (ref, method, _arguments)
  {
    return new Call(this, ref + (this.php ? '->' : '.') + method, _arguments);
  }
  
  assign (to, from, op = '=')
  {
    return this.instruct(new Assignment(this, to, from, op));
  }
  
  instanciate (_class, _arguments)
  {
    return new Instanciate(this, _class, _arguments);
  }
  
  loop (property, content)
  {
    return new Loop(this, property, content);
  }
  
  instruct (content)
  {
    return new Instruction(this, content);
  }
  
  string (content)
  {
    return new _String(this, content);
  }
  
  text ()
  {
    return new Text(this, Object.keys(arguments).map(a => arguments[a]));
  }
  
  use (content)
  {
    this.add(new Use(this, content));
  }
  
  add (content)
  {
    this.content.push(content);
  }
  
  render ()
  {
    return this.content.join('');
  }

}