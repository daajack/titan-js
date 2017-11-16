
const Directory = require('./Directory.js');
const File = require('./File.js');
const FileStandalone = require('./FileStandalone.js');

module.exports = class Main
{
  constructor()
  {
    this.fs = require('fs');
    
    this.files = {};
    this.children = {};
    this.scripts = {};
    this.root = null;
  }
  
  getFile (path)
  {
    if (!this.files[path])
    {
      this.files[path] = new FileStandalone(this, path);
    }
    
    return this.files[path];
  }
  
  async exists (path)
  {
    let fs = this.fs;
    
    return new Promise( (resolve, reject) =>
    {
      fs.access(path, fs.constants.R_OK, err => 
      {
        resolve(!err);
      });
    });
  }
  
  async findFile(content)
  {
    let result;
    let paths = content.split('/');
    let current = this.root;
    let extension = '.vml';
    
    while (paths.length)
    {
      let name = paths.pop();
      let fileName = name + extension;
      let file = current.children[fileName];

      if (file)
      {
        result = file;
        break;
      }
      else
      {
        file = await this.exists(current.path + '/' + fileName);
        
        if (file)
        {
          result = current.children[fileName] = new File(this, current, fileName);
        }
        else
        {
          let directory = current.children[name];

          if (directory)
          {
            current = directory;
          }
          else
          {
            let dir = await this.exists(current.path + '/' + name);

            if (dir)
            {
              result = current.children[name] = new Directory(this, current, name);
            }
            else
            {
              if (!paths.length)
              {
                throw new Error('Path invalid, cannot find file or directory : ' + name + ' in ' + content)
              }
            }
          }
        }
      }
    }
    
    return result;
  }
}