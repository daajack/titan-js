
module.exports = class View
{
  constructor()
  {
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
  
  render ()
  {
    return this.content;
  }
}