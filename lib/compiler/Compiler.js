
const Context = require('./language/Context.js');
const View = require('../view/compiler/View.js');

module.exports = class Compiler
{
  prepare (document)
  {
    let context = new Context();
    let view = new View();
    
    view.prepare(document.documentElement);
    let result = view.compile(context);
    
    return result;
  }
}