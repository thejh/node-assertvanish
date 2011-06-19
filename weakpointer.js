(function() {
  var EphemeronTable, WeakPointer;
  EphemeronTable = require('overload').EphemeronTable;
  module.exports = WeakPointer = (function() {
    function WeakPointer(target) {
      this.eph_table = new EphemeronTable();
      this.eph_table.set(target, null);
    }
    WeakPointer.prototype.get = function() {
      var keys;
      keys = this.eph_table.keys();
      if (keys.length > 0) {
        return keys[0];
      }
    };
    return WeakPointer;
  })();
  ({
    isAlive: function() {
      return this.eph_table.keys().length > 0;
    }
  });
}).call(this);
