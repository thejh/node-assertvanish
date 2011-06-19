assertVanish = require './index'

bar = []
createThing = (name, data) ->
  thing = {name: name, data: data, first: bar.length > 0}
  # MEMORY LEAK!
  bar.push thing
test = ->
  myData = {a: 4, b: 5}
  myThing = createThing "foo", myData
  assertVanish myData, 5000
setInterval test, 10000
