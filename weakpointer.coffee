{EphemeronTable} = require 'overload'

module.exports = class WeakPointer
  constructor: (target) ->
    @eph_table = new EphemeronTable()
    @eph_table.set target, null

  get: ->
    keys = @eph_table.keys()
    if keys.length > 0
      keys[0]

	isAlive: ->
    @eph_table.keys().length > 0
