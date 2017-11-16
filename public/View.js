
module.exports = class View
{
  constructor(app)
  {
    this.app = app;
    this.content = '';
  }
  
  get (path)
  {
    console.log('get ' + path);
  }
  
  add (content)
  {
    this.content += content;
  }
  
  call (path)
  {
    return this.app.call(path);
  }
  
  render ()
  {
    return this.content;
  }
}