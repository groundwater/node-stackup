'use strict';

// long traces are enabled by default
var lt = require('./index.js');

//----- Demo -----//
var k = 0;
setImmediate(function A() {
  process.nextTick(function SHOULD_NOT_APPEAR_IN_TRACE() {
    setTimeout(function SHOULD_NOT_APPEAR_IN_TRACE() {
      return;
    }, 500);
    return;
  });
  setTimeout(function B() {
    process.nextTick(function SHOULD_NOT_APPEAR_IN_TRACE() {
      return;
    });
    process.nextTick(function C() {
      (function SHOULD_NOT_APPEAR_IN_TRACE(){
        return;
      })();
      throw new Error('k=' + k);
    });
  },100);
  setTimeout(function SHOULD_NOT_APPEAR_IN_TRACE() {
    console.log("SHOULD NOT APPEAR IN TRACE");
    return;
  }, 200);
});
