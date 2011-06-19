How to use it
=============
For a code example, see test.js and test.coffee.

To activate vanish assertions, you have to call node with `--expose-debug-as=debug`.

    node --expose-debug-as=debug test.js

Example output:

    'Object ({})' (type 'Object') is still alive!
    Object ({})
      Array ({'0': [REFERENCE]})
        Function without a name from /home/jann/gitty/node-assertvanish/test.js:16
          Timer ({'repeat': 1, 'callback': [REFERENCE], 'start': [function "start"], 'stop': [function "stop"], 'again': [function "again"]})

    /home/jann/gitty/node-assertvanish/index.js:19
            throw "unfullfilled vanish assertion";
            ^
    unfullfilled vanish assertion

Compiling
=========

    cake build
