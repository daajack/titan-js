'use strict';

global.__base = '/lib';

window.titan = {};

(function(container) {

  let App = require('./lib/App.js');
  let Compiler = require('./lib/compiler/Compiler.js');
  
  let View = require('./public/View.js');
  let Query = require('./public/Query.js');
  
  container.App = App;
  container.Compiler = Compiler;
  container.View = View;
  container.Query = Query;
  
})(window.titan)

