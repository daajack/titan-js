
const Element = require('./Element.js');
const Text = require('./Attribute.js');
const Attribute = require('./Attribute.js');

module.exports = class Document
{
  constructor(parser)
  {
    this.parser = parser;
  }
  
  parse (content)
  {
    if (!this.parser)
    {
      const utils = require('../utils.js');
      
      if (utils.isBrowser())
      {
        this.parser = new DOMParser;
      }
      else
      {
        throw new Error('No parser defined');
      }
    }
    
    let dom = this.parser.parseFromString(content, 'text/xml');
    
    this.loadDOM(dom);
  }
  
  loadDOM (dom)
  {
    let document = this;
    
    function loadText(datas)
    {
      let text = new Text(document);
      
      text.nodeName = '#text';
      text.nodeValue = datas.nodeValue;
      
      return text;
    }
    
    function loadAttribute(datas)
    {
      let attr = new Attribute(document);
      
      attr.namespaceURI = datas.namespaceURI;
      attr.localName = datas.localName;
      attr.prefix = datas.prefix;
      attr.name = datas.name;
      attr.value = datas.nodeValue;
      
      return attr;
    }
    
    function loadElement(datas)
    {
      let el = new Element(document);
      
      el.document = document;
      el.namespaceURI = datas.namespaceURI;
      el.nodeName = datas.nodeName;
      el.localName = datas.localName;
      el.prefix = datas.prefix;
      el.name = datas.name;
      
      let children = [];
      
      if (datas.childNodes)
      {
        let len = datas.childNodes.length;
        
        let types = {
          element : 1,
          attribute : 2,
          text : 3,
          cdata : 4,
          entity_reference : 5,
          entity : 6,
          processing : 7,
          comment : 8,
          document : 9,
          document_type : 10,
          document_fragment : 11,
          notation : 12,
        };

        for (let i = 0; i < len; i++)
        {
          let sdatas = datas.childNodes[i];
          let child;

          switch (sdatas.nodeType) 
          {
            case types.text  :
              
              let val = sdatas.data.trim();

              if (val)
              {
                children.push(loadText(sdatas));
              }
              break;
              
            case types.element :
              
              children.push(loadElement(sdatas));
              break;
              
            case types.comment :
              break;
              
            default :
              
              throw new Error('Unknown node type : ' + sdatas.nodeType);
          }
        }
      }
      
      el.children = children;
      
      let attributes = [];
      
      if (datas.attributes)
      {
        let len = datas.attributes.length;

        for (let i = 0; i < len; i++)
        {
          let attr = datas.attributes[i];
          
          if (attr.localName !== 'xmlns' && attr.prefix !== 'xmlns')
          {
            attributes.push(loadAttribute(attr));
          }
        }
      }

      el.attributes = attributes;
      
      return el;
    }
//console.log(dom.documentElement);
    var root = loadElement(dom.documentElement);
    
    this.documentElement = root;
  }
}