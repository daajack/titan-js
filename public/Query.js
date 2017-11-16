
module.exports = class Query
{
  constructor()
  {
    this.elements = [];
  }
  
  addElements (elements)
  {
    this.elements = elements;
  }
  
  render ()
  {
    return {
      items : [
        {
          name : 'Franck',
          lastname : 'Sinatra'
        },
        {
          name : 'Aretha',
          lastname : 'Franklin'
        }
      ]
    };

    return this.content;
  }
}