WeakPointer = require './weakpointer'

unless debug?.Debug?
  module.exports = ->
  module.exports.active = false
  return

{MakeMirror: makeMirror, sourcePosition, findScript} = debug.Debug

assertVanish = (thing, timeout) ->
  weakAssertVanish new WeakPointer(thing), timeout

weakAssertVanish = (weakPointer, timeout) ->
  setTimeout ->
    if thing = weakPointer.get()
      console.error "'#{flatStringify thing}' (type '#{thing?.constructor?.name}') is still alive!"
      printRefTree makeMirror thing
      throw "unfullfilled vanish assertion"
  , timeout

makeIndent = (level) ->
  oneLevel = "  "
  indent = ""
  for [0...level]
    indent += oneLevel
  indent

simpleStringify = (thing, referencee) ->
  type = typeof thing
  if thing is referencee
    "[REFERENCE]"
  else if type is 'function' and thing.name?
    "[function \"#{thing.name}\"]"
  else if type is 'object' or type is 'function'
    "[#{type}]"
  else
    thing

flatStringify = (thing, referencee) ->
  if typeof thing is 'function'
    script = findScript thing
    position = sourcePosition thing
    location = "#{script.name}:#{1 + script.lineFromPosition position}"
    "Function #{if thing.name then "'#{thing.name}'" else 'without a name'} from #{location}"
  else
    flatjson = '{' + ("'#{key}': #{simpleStringify value, referencee}" for key, value of thing).join(', ') + '}'
    type = thing.constructor?.name or 'object'
    "#{type}#{if thing.name then " '#{thing.name}'" else ''} (#{flatjson})"

printRefTree = (mirror, indentLevel = 0, referencee, seenTree = []) ->
  for seen in seenTree when seen is mirror
    console.error "#{makeIndent indentLevel}cyclic"
    return
  console.error "#{makeIndent indentLevel}#{flatStringify mirror.value_, referencee}"
  seenTree.push mirror
  for referencer in mirror.referencedBy()
    printRefTree referencer, indentLevel + 1, mirror.value_, seenTree
  seenTree.pop()

module.exports = assertVanish
module.exports.active = true
