(function() {
  var assertVanish, bar, createThing, test;
  assertVanish = require('./index');
  bar = [];
  createThing = function(name, data) {
    var thing;
    thing = {
      name: name,
      data: data,
      first: bar.length > 0
    };
    return bar.push(thing);
  };
  test = function() {
    var myData, myThing;
    myData = {
      a: 4,
      b: 5
    };
    myThing = createThing("foo", myData);
    return assertVanish(myData, 5000);
  };
  setInterval(test, 10000);
}).call(this);
