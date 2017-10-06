
module.exports = class Expression
{
  constructor()
  {
  }
  
  parse (tree, content)
  {
//    let content = content.split('');
    
//    this.parseStrings(content);
//    this.parseGroups(content);
    let result = this.parsePath(tree, content);
    
    return [result];
  }
  
  parsePath (tree, content)
  {
    let result = tree;
    
    if (content === '*')
    {
      result = tree.getStar();
    }
    else
    {
      let content = content.split('.');

      while (content.length)
      {
        result = result.getElement(content.shift());
      }
    }
    
    return result;
  }
  
  parseGroups (content)
  {
    let i = 0;
    let l = content.length;
    let opened = 0;
    
    let Unknown = new Class
    {
      construct ()
      {
        this.unknown = true;
        this.content = [];
      }
    };
    
    let result = [];
    let current;
    
    while (i < l)
    {
      let c = content[i];
      
      if (c === '(')
      {
        let previous = current;
        opened.push(previous);
        current = new Group();
        
        previous.content.push(current);
      }
      else if (c === ')')
      {
        current = opened.pop();
      }
      else
      {
        if (!current)
        {
          current = new Unknown;
          result.push(current);
        }
        
        current.content.push(c);
      }
      
      i++;
    }
  }
    
  parseStrings (path)
  {
    let i = 0;
    let l = path.length;
    let open = true;
    let result = [];
    let k = -1;
    
    while (i < l)
    {
      let c = path[i];
      
      if (c === '\'')
      {
        if (!i || path[i - 1] !== '\\')
        {
          if (open)
          {
            result.push(new _String());
          }
          else
          {
            result.push('');
          }
          
          k++;
          open = !open;
        }
      }
      else
      {
        if (open) result[k] += c;
        else result[k].content += c; 
      }
      
      i++;
    }
  }
}