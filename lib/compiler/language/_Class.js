
const Variable = require('./Variable.js');

module.exports = class _Class extends Variable
{
  toString ()
  {
    return this.name;
  }
}