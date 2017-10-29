
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
  
  async compile (context)
  {
    context.view.tree.addElement(this.path);
    return context.php ? context.tree.call('read', [this.path]) : context.tree.get(this.path);
  }
}