
module.exports = class Read
{
  constructor(template)
  {
    this.template = template;
  }
  
  prepare (node)
  {
    this.path = node.getAttribute('select');
  }
  
  compile (context)
  {
    return context.tree.get(this.path);
  }
}