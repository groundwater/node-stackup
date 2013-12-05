'use strict';

// long traces are enabled by default
var lt = require('./index.js');

var util = require('util');
var fs   = require('fs');

//----- Demo -----//
// throw new Error();

var k = 0;
setImmediate(function A() {
  process.nextTick(function SHOULD_NOT_APPEAR_IN_TRACE() {
    process.nextTick(function SHOULD_NOT_APPEAR_IN_TRACE() {
      return 1;
    });
    return 2;
  });
  setTimeout(function B() {
    process.nextTick(function SHOULD_NOT_APPEAR_IN_TRACE() {
      return 3;
    });
    process.nextTick(function C() {
      (function SHOULD_NOT_APPEAR_IN_TRACE(){
        return 4;
      })();
      throw new Error('k=' + k);
    });
  },100);
  setTimeout(function SHOULD_NOT_APPEAR_IN_TRACE() {
    return 6;
    console.log("SHOULD NOT APPEAR IN TRACE");
  }, 200);
});
