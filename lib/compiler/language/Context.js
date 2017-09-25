
const Variable = require('./Variable.js');
const Instanciate = require('./Instanciate.js');
const Assignment = require('./Assignment.js');
const Call = require('./Call.js');
const Instruction = require('./Instruction.js');
const Loop = require('./Loop.js');
const Concat = require('./Concat.js');
const Text = require('./Text.js');

module.exports = class Context
{
  constructor (parent)
  {
    this.variables = {};
    this.content = [];
    this.parent = parent;
  }
  
  addVariable (name)
  {
    name = name || 'var' + this.variables.length;
    
    let variable = new Variable(this, name)
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
  
  context ()
  {
    return new Context(this);
  }
  
  call (ref, method, _arguments)
  {
    return new Call(this, ref + '.' + method, _arguments);
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
  
  text ()
  {
    return new Text(this, Object.keys(arguments).map(a => arguments[a]));
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