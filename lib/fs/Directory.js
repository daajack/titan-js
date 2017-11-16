
module.exports = class Directory
{
  constructor(fs, parent, name)
  {
    this.fs = fs;
    this.parent = parent;
    this.name = name;
    
    this.children = {};
  }
  
  get path ()
  {
    return this.parent.path + '/' + this.name;
  }
}