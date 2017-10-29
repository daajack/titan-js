
const Tree = require('./Tree');
const Collection = require('../../sql/Collection.js');
const Expression = require('./expression/Expression.js');

module.exports = class Apply
{
  constructor(context)
  {
    this.context = context;
  }
  
  prepare (node)
  {
    this.select = node.getAttribute('select');
    this.mode = node.getAttribute('mode');
  }
  
  async compile (context, tree, template)
  {
    let expression = new Expression;
    let trees = expression.parse(tree, this.select);
    let result;

    trees.forEach(t => 
    {
      if (!t instanceof Tree)
      {
        throw new Error('Not a tree');
      }
    });
    
    if (trees.length > 1)
    {
      throw new Error('Not implemented');
    }
    else
    {
      let childTree = !trees.length ? tree : trees[0];
      template = template.view.lookupTemplate(childTree, this.mode);

      if (!template)
      {
        if (this.required)
        {
          throw new Error('No template found');
        }
      }
      else
      {
        if (tree instanceof Collection)
        {
          let items = context.php ? context.tree : context.tree.get('items');
          let loop = context.loop(items);
          loop.context.view = context.view;
          loop.add(await template.compile(tree.table, loop.context));

          result = context.instruct(loop.compile());
        }
        else
        {
          throw new Error('Not implemented');
        }
      }
    }
    
    return result;
  }
}