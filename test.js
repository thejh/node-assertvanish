(function() {
  var assertVanish, bar, foo, qux;
  assertVanish = require('./index');
  console.error("vanish assertions are active: " + assertVanish.active);
  qux = [];
  foo = function() {
    var a;
    a = {};
    assertVanish(a, 4000);
    return a;
  };
  bar = function(b) {
    return qux.push(b);
  };
  bar(foo());
  setInterval(function() {
    return console.error("" + qux.length + " elements in `qux`");
  }, 1000);
}).call(this);
