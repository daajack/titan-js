
module.exports = class FileStandalone
{
  constructor(fs, path)
  {
    this.fs = fs;
    this.path = path;
  }
  
  async read ()
  {
    let utils = require('../utils.js');
    
    if (utils.isBrowser())
    {
      return await this.readWithXHR();
    }
    else
    {
      return await this.readWithFS();
    }
  }
  
  async readWithXHR ()
  {
    let xhr = new XMLHttpRequest();

    xhr.open("GET", this.path, true);
    
    return new Promise( (resolve, reject) =>
    {
      xhr.onload = function () 
      {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.response);
        } else {
          reject({
            status: this.status,
            statusText: xhr.statusText
          });
        }
      };

      xhr.onerror = function () {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      };
      
      xhr.send();
    });
  }
  
  async readWithFS ()
  {
    let fs = require('fs');
    
    return new Promise((resolve, reject) => 
    {
      fs.readFile(this.path, 'utf8', (err, data) =>
      {
        if (err) reject(err);
        else resolve(data);
      });
    })
  }
  
}