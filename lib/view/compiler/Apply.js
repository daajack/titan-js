
module.exports = class Apply
{
  constructor(context)
  {
    this.context = context;
  }
  
  prepare (node)
  {
    this.path = node.getAttribute('select');
    this.mode = node.getAttribute('mode');
  }
  
  compile (context, template)
  {
    template = template.view.lookupTemplate(this.mode)[0];
    
    let loop = context.loop(context.tree.get(this.path));
    loop.add(template.compile(loop.context));
    
    return context.instruct(loop.compile());
  }
}