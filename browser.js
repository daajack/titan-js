'use strict';

global.__base = '/lib';

window.titan = {};

(function(container) {

  let Compiler = require('./lib/compiler/Compiler.js');
  
  let View = require('./public/View.js');
//  let Query = require('./lib/view/public/View.js');
  
  
  container.Compiler = Compiler;
  container.View = View;
  
})(window.titan)

