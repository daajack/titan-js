
module.exports = class File
{
  constructor(fs, parent, name)
  {
    this.fs = fs;
    this.parent = parent;
    this.name = name;
  }
  
  get path ()
  {
    return this.parent.path + '/' + this.name;
  }
  
  async open ()
  {
  }
}