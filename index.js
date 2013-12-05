'use strict';

if(!process.addAsyncListener) 
                  require('async-listener');
var util        = require('util');
var TraceModule = require('./trace')(Error, __dirname + '/node_modules/async-listener');

Error.stackTraceLimit = Infinity;

// we need a single global for long traces
var activeTrace;

// -- async listener -- //

// each time an async event is scheduled, i.e. setImmediate, or
// process.nextTick, etc. we capture the stack at that exact point
// this is going to be a crap ton of stack traces, but it will be
// very accurate!
function asyncListener() {
  return TraceModule.NewWithParent(activeTrace, asyncListener);
}

// the async handler glues to relevant previous stack trace to
// the next tone
var asyncHandlers = {
  before : function before(context, trace) {
    // the next beginTrace needs to know the current trace
    activeTrace      = trace;
  }
}

process.addAsyncListener(asyncListener, asyncHandlers);

// when we get an error, format and print the traces in a meaningful way
process.on('uncaughtException', function onUncaughtException(err) {
  console.log(activeTrace.toString(err.stack));
});
