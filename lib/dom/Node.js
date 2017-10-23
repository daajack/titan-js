
class Node
{
  constructor(document)
  {
    this.document = document;
  }
}

Node.ELEMENT = 1;
Node.ATTRIBUTE = 2;
Node.TEXT = 3;
Node.COMMENT = 8;

module.exports = Node;