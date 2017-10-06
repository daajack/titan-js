
module.exports = class Window
{
  constructor(php)
  {
    this.php = php;
  }
  
  render ()
  {
    let dummy = this.context.getVariable('dummy');
    
    return [
      this.php ? '' : '(function(tree) {\n',
      this.context.render(),
      'return ' + dummy.call('render') + ';',
      this.php ? '' : '})(tree)\n'
    ].join('');
  }
}