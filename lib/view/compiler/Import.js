
const Document = require('../../dom/Document.js');
const File = require('../../fs/File.js');

module.exports = class Import
{
  constructor (view)
  {
    this.view = view;
  }

  async prepare (node)
  {
    let view = this.view;
    let path = node.read();
    let fs = this.view.compiler.app.fs;
    
    var content = await fs.getFile(path).read();

    if (!content)
    {
      throw new Error('No content found');
    }

    let document = new Document(node.document.parser);
    document.parse(content);

    await view.parseChildren(document.element.children);
  }
}
