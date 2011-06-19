(function() {
  var WeakPointer, assertVanish, findScript, flatStringify, makeIndent, makeMirror, printRefTree, simpleStringify, sourcePosition, weakAssertVanish, _ref;
  WeakPointer = require('./weakpointer');
  if ((typeof debug !== "undefined" && debug !== null ? debug.Debug : void 0) == null) {
    module.exports = function() {};
    module.exports.active = false;
    return;
  }
  _ref = debug.Debug, makeMirror = _ref.MakeMirror, sourcePosition = _ref.sourcePosition, findScript = _ref.findScript;
  assertVanish = function(thing, timeout) {
    return weakAssertVanish(new WeakPointer(thing), timeout);
  };
  weakAssertVanish = function(weakPointer, timeout) {
    return setTimeout(function() {
      var thing, _ref2;
      if (thing = weakPointer.get()) {
        console.error("'" + (flatStringify(thing)) + "' (type '" + (thing != null ? (_ref2 = thing.constructor) != null ? _ref2.name : void 0 : void 0) + "') is still alive!");
        printRefTree(makeMirror(thing));
        throw "unfullfilled vanish assertion";
      } else {
        return console.error("vanished as expected");
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
    var flatjson, key, location, position, script, type, value, _ref2;
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
          value = thing[key];
          _results.push("'" + key + "': " + (simpleStringify(value, referencee)));
        }
        return _results;
      })()).join(', ') + '}';
      type = ((_ref2 = thing.constructor) != null ? _ref2.name : void 0) || 'object';
      return "" + type + (thing.name ? " '" + thing.name + "'" : '') + " (" + flatjson + ")";
    }
  };
  printRefTree = function(mirror, indentLevel, referencee) {
    var referencer, _i, _len, _ref2, _results;
    if (indentLevel == null) {
      indentLevel = 0;
    }
    console.error("" + (makeIndent(indentLevel)) + (flatStringify(mirror.value_, referencee)));
    _ref2 = mirror.referencedBy();
    _results = [];
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      referencer = _ref2[_i];
      _results.push(printRefTree(referencer, indentLevel + 1, mirror.value_));
    }
    return _results;
  };
  module.exports = assertVanish;
  module.exports.active = true;
}).call(this);
