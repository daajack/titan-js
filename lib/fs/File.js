
module.exports = class File
{
  constructor(path)
  {
    this.path = path;
  }
  
  open (callback)
  {
    let utils = require('../utils.js');
    
    if (utils.isBrowser())
    {
      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          callback(this.responseText);
        }
      };
      
      xhttp.open("GET", this.path, true);
      xhttp.send();
    }
    else
    {
      let fs = require('fs');
      
      fs.readFile(this.path, 'utf8', function(err, datas)
      {
        callback(datas);
      });
    }
  }
}