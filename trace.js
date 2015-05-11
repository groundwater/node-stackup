var util = require('util');

function Trace(module) {
  this.module = module;
  this.parent = null;
  this.stack  = null;
}

Trace.prototype.toString = function toString(stack) {
  var out = [];

  if (stack)      out.push(this.__filter(stack.split(/\n+/)).join('\n'));
  if (this.stack) out.push(this.__format(this.stack.stack));

  var current = this.parent;

  while (current) {
    if (current.stack) out.push(current.__format(current.stack.stack));
    current = current.parent;
  }

  return out.join('\n');
}

Trace.prototype.__format = function __format(stack) {
  var split = stack.split(/\n+/);

  // get rid of [object Object] line
  split.shift();
  split.unshift('    ---- async ----');

  return this.__filter(split).join('\n');
}

Trace.prototype.__filter = function __filter(split) {
  var filter  = this.module.filter;
  var out     = [];

  split.forEach(function eachLine(line) {
    // if there is no filter, add everything
    // otherwise only add stuff that doesn't match the filter
    // generally you should filter out THIS module by
    // matching on the __dirname property
    if (!filter || !line.match(filter)) {
      out.push(line);
    }
  });

  return out;
}

function TraceModule(Error, filter) {
  this.Error   = Error;
  this.filter = filter;
}

TraceModule.prototype.New = function New() {
  return new Trace(this);
}

TraceModule.prototype.NewWithParent = function NewWithParent(parent, omit) {
  var trace     = this.New();
  var omitStack = omit || NewWithParent;
  var stack     = {};

  this.Error.captureStackTrace(stack, omitStack);

  trace.parent  = parent;
  trace.stack   = stack;

  return trace;
}

module.exports = function (Error, filter) {
  return new TraceModule(Error, filter);
}
