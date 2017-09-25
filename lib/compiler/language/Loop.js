
module.exports = class Loop
{
  constructor(context, ref, content)
  {
    this.context = context.context();
    this.ref = ref;
    this.content = [];
//    this.isStructure = true;

    let item = this.context.addVariable('item');
    this.context.addVariable('key');
    
    this.context.tree = item;
    
    if (content) this.add(content);
  }
  
  add (content)
  {
    this.content.push(content);
  }
  
  compile ()
  {
    return this.ref.call('forEach', [this.context.text('function(item, key) {\n  ', this.content, '}')]);
  }
}