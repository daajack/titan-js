
const Field = require('./Field.js');
const Foreign = require('./Foreign.js');
//const Field = require('./Reference.js');

module.exports = class Table
{
  constructor()
  {
    
  }
  
  parse (element)
  {
    let el = element.children[0];
    this.name = el.getAttribute('name');
    
    let children = [];
//console.log(element + '');
    el.children.forEach(child => {
//console.log(child);
      let result;
      
      switch (child.localName)
      {
        case 'field' : result = new Field(); result.prepare(child); break;
        case 'foreign' : result = new Foreign(); result.prepare(child); break;
//        case 'reference' : result = new Reference(); result.prepare(child); break;
        default : throw new Error('Unknown table field : ' + child);
      }
      
      children.push(result);
    });
    
    this.children = children;
  }
  
}