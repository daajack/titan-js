
module.exports = class Window
{
  constructor(compiler, php)
  {
    this.compiler = compiler;
    this.php = php;
    this._path = '';
    this.name = '';
  }
  
  set path(val)
  {
    this._path = val;
  }
  
  get path()
  {
    return this._path;
  }
  
  render ()
  {
    let context = this.context;
    let dummy = context.getVariable('dummy');
    
    return [
      context.render(),
      'return ' + dummy.call('render') + ';',
    ].join('');
  }
}