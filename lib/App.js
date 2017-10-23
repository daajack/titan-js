
module.exports = class App
{
  constructor()
  {
    let Fs = require('./fs/Main.js');
    
    this.fs = new Fs;
    this.device = null;
    this.sql = null;
  }
}