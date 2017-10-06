
module.exports = class Use
{
  constructor(context, name)
  {
    this.context = context;
    this.name = name;
  }
  
  toString ()
  {
    let name = this.name.replace(/\./g, '\\');
    return this.context.php ? `use ${name};\n` : '';
  }
}