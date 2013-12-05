# Stackup

Stackup is a long stack trace module build off of async listeners.

## Install

```
npm install --save stackup
```

Require the module at the start of your application:

```
require('stackup');
```

Errors that propagate to `uncaughtException` will magically turn into long stack traces.

## Example Output

```
Error: Something went wrong
    at C (/home/jacob/stackup/demo.js:28:13)
    at process._tickCallback (node.js:415:13)
    ---- async ----
    at B (/home/jacob/stackup/demo.js:24:13)
    at Timer.listOnTimeout [as ontimeout] (timers.js:110:15)
    ---- async ----
    at global.setTimeout (node.js:174:27)
    at Object.A (/home/jacob/stackup/demo.js:20:3)
    at processImmediate [as _immediateCallback] (timers.js:330:15)
    ---- async ----
    at global.setImmediate (node.js:194:29)
    at Object.<anonymous> (/home/jacob/stackup/demo.js:13:1)
    at Module._compile (module.js:456:26)
    at Object.Module._extensions..js (module.js:474:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:312:12)
    at Function.Module.runMain (module.js:497:10)
    at startup (node.js:119:16)
    at node.js:901:3
```

## Caveats

I haven't really tested this yet.

- it may die horribly if you throw a non-object
