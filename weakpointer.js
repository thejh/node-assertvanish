(function() {
  var EphemeronTable, WeakPointer;
  EphemeronTable = require('overload').EphemeronTable;
  WeakPointer = (function() {
    function WeakPointer(target) {
      var eph_table;
      eph_table = new EphemeronTable();
      eph_table.set(target, null);
    }
    WeakPointer.prototype.get = function() {
      var keys;
      keys = eph_table.keys();
      if (keys.length > 0) {
        return keys[0];
      }
    };
    return WeakPointer;
  })();
  ({
    isAlive: function() {
      return eph_table.keys().length > 0;
    }
  });
}).call(this);
