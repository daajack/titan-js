
module.exports = class App
{
  constructor(dir)
  {
    const Fs = require('./fs/Main.js');
    const Root = require('./fs/Root.js');
    const Directory = require('./fs/Directory.js');
    let fs = new Fs;
    let root = new Root(fs);
    root.base = dir;
    
    fs.root = root;
    
    this.fs = fs;
    this.device = null;
    this.sql = null;
    
    this.isBrowser = typeof window !== 'undefined';
  }
  
  call (path)
  {
    let content = this.fs.scripts[path];
    
    if (!content)
    {
      throw new Error('No content to eval in script : ' + path);
    }
    
    return this.eval(content);
  }
  
  eval (content)
  {
    var script = eval('(function(app) { ' + content + ' })');
    let result = script(this);
    
    return result;
  }
}