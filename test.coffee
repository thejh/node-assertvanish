assertVanish = require './index'

console.error "vanish assertions are active: #{assertVanish.active}"

qux = []

foo = ->
  a = {}
  assertVanish a, 4000
  a

bar = (b) ->
  qux.push b

bar foo()

setInterval ->
  console.error "#{qux.length} elements in `qux`"
, 1000
