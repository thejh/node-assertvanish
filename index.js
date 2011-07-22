(function() {
  var WeakPointer, assertVanish, findScript, flatStringify, makeIndent, makeMirror, printRefTree, simpleStringify, sourcePosition, weakAssertVanish, _ref;
  WeakPointer = require('./weakpointer');
  if ((typeof debug !== "undefined" && debug !== null ? debug.Debug : void 0) == null) {
    module.exports = function() {};
    module.exports.active = false;
    return;
  }
  _ref = debug.Debug, makeMirror = _ref.MakeMirror, sourcePosition = _ref.sourcePosition, findScript = _ref.findScript;
  assertVanish = function(thing, timeout, options) {
    if (options == null) {
      options = {};
    }
    return weakAssertVanish(new WeakPointer(thing), timeout, options);
  };
  weakAssertVanish = function(weakPointer, timeout, options) {
    return setTimeout(function() {
      var thing, _ref2;
      if (thing = weakPointer.get()) {
        if (!options.silent) {
          console.error("'" + (flatStringify(thing)) + "' (type '" + (thing != null ? (_ref2 = thing.constructor) != null ? _ref2.name : void 0 : void 0) + "') is still alive!");
          printRefTree(makeMirror(thing));
          throw "unfullfilled vanish assertion";
        }
        return typeof options.callback === "function" ? options.callback(true, thing) : void 0;
      } else {
        return typeof options.callback === "function" ? options.callback(false, null) : void 0;
      }
    }, timeout);
  };
  makeIndent = function(level) {
    var indent, oneLevel, _i;
    oneLevel = "  ";
    indent = "";
    for (_i = 0; 0 <= level ? _i < level : _i > level; 0 <= level ? _i++ : _i--) {
      indent += oneLevel;
    }
    return indent;
  };
  simpleStringify = function(thing, referencee) {
    var type;
    type = typeof thing;
    if (thing === referencee) {
      return "[REFERENCE]";
    } else if (type === 'function' && (thing.name != null)) {
      return "[function \"" + thing.name + "\"]";
    } else if (type === 'object' || type === 'function') {
      return "[" + type + "]";
    } else {
      return thing;
    }
  };
  flatStringify = function(thing, referencee) {
    var flatjson, key, location, position, script, type, _ref2;
    if (typeof thing === 'function') {
      script = findScript(thing);
      position = sourcePosition(thing);
      location = "" + script.name + ":" + (1 + script.lineFromPosition(position));
      return "Function " + (thing.name ? "'" + thing.name + "'" : 'without a name') + " from " + location;
    } else {
      flatjson = '{' + ((function() {
        var _results;
        _results = [];
        for (key in thing) {
          if (thing.__lookupGetter__(key) != null) {
            continue;
          }
          _results.push("'" + key + "': " + (simpleStringify(thing[key], referencee)));
        }
        return _results;
      })()).join(', ') + '}';
      type = ((_ref2 = thing.constructor) != null ? _ref2.name : void 0) || 'object';
      return "" + type + (thing.name ? " '" + thing.name + "'" : '') + " (" + flatjson + ")";
    }
  };
  printRefTree = function(mirror, indentLevel, referencee, seenTree, seen) {
    var referencer, referencers, seenThing, _i, _j, _len, _len2;
    if (indentLevel == null) {
      indentLevel = 0;
    }
    if (seenTree == null) {
      seenTree = [];
    }
    if (seen == null) {
      seen = {};
    }
    referencers = mirror.referencedBy();
    if (referencers.length === 0) {
      console.error("" + (makeIndent(indentLevel)) + "NATIVE CAUSE: " + (flatStringify(mirror.value_, referencee)));
    }
    for (_i = 0, _len = seenTree.length; _i < _len; _i++) {
      seenThing = seenTree[_i];
      if (seenThing === mirror) {
        console.error("" + (makeIndent(indentLevel)) + "cyclic");
        return;
      }
    }
    if (seen[mirror.handle_]) {
      console.error("" + (makeIndent(indentLevel)) + "already seen");
      return;
    }
    seen[mirror.handle_] = true;
    console.error("" + (makeIndent(indentLevel)) + (flatStringify(mirror.value_, referencee)));
    seenTree.push(mirror);
    for (_j = 0, _len2 = referencers.length; _j < _len2; _j++) {
      referencer = referencers[_j];
      printRefTree(referencer, indentLevel + 1, mirror.value_, seenTree, seen);
    }
    return seenTree.pop();
  };
  module.exports = assertVanish;
  module.exports.active = true;
}).call(this);
