
const Directory = require('../fs/Directory.js');
const File = require('../fs/File.js');

module.exports = class Main
{
  constructor()
  {
    
  }
  
  getFile (path)
  {
    return new File(path);
  }
}