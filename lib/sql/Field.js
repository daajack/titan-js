
module.exports = class Field
{
  constructor()
  {
    
  }
  
  prepare (node)
  {
    this.name = node.getAttribute('name');
  }
}