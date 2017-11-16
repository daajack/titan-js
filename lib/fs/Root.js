
const Directory = require('./Directory.js');

module.exports = class Root extends Directory
{
  constructor(fs)
  {
    super(fs, null, '');
    this.fs = fs;
    this.base = '';
  }
  
  get path()
  {
    return this.base;
  }
}