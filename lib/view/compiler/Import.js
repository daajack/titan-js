
const Document = require('../../dom/Document.js');
const File = require('../../fs/File.js');

module.exports = class Import
{
  constructor (view)
  {
    this.view = view;
  }

  prepare (node)
  {
    let view = this.view;
    let path = node.read();
    let file = new File(path);
    
    view.addWait();

    file.open(content => {
      
      if (!content)
      {
        throw new Error('No content found');
      }

      let document = new Document(node.document.parser);
      document.parse(content);
      
      view.parseChildren(document.element.children);
      view.removeWait();
    });
  }
}
