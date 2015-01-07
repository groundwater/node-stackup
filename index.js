'use strict';

if(!process.addAsyncListener)
                  require('async-listener');
var util        = require('util');
var TraceModule = require('./trace')(Error, __dirname + '/node_modules/async-listener');

Error.stackTraceLimit = Infinity;

// we need a single global for long traces
var activeTrace;

// -- async listener -- //

// the async handler glues the previous stack trace to
// the next one
var asyncHandlers = {
  create : function create() {
    // each time an async event is scheduled, i.e. setImmediate, or
    // process.nextTick, etc. we capture the stack at that exact point
    // this is going to be a crap ton of stack traces, but it will be
    // very accurate!
    return TraceModule.NewWithParent(activeTrace, create);
  },
  before : function before(context, trace) {
    // activeTrace is used to link child traces to their parents
    activeTrace = trace;
  },
  error : function error(trace, error) {
    // replace the short stack with the long stack
    if (activeTrace) {
      error.stack = activeTrace.toString(error.stack);
    }

    // do *not* handle the error, let it propagate
    // chances are things are about to crash, we don't
    // want to stop that. we just want to provide a better,
    // longer stack trace
    return false;
  }
}

process.addAsyncListener(asyncHandlers);
