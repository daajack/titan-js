'use strict';

window.titan = {};

(function(container) {

  let Compiler = require('./lib/compiler/Compiler.js');
  let View = require('./lib/view/public/View.js');
  
  container.Compiler = Compiler;
  container.View = View;
  
})(window.titan)

