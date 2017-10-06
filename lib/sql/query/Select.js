
module.exports = class Select
{
  constructor()
  {
    this.columns = [];
  }
  
  addElement (element)
  {
    if (this.columns.indexOf(element) === -1)
    {
      this.columns.push(element);
    }
  }
  
  compile (context)
  {
    context.add(context.instruct(this.dummy.call('addElements', this.columns)));
  }
}