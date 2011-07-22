WeakPointer = require './weakpointer'

unless debug?.Debug?
  module.exports = ->
  module.exports.active = false
  return

{MakeMirror: makeMirror, sourcePosition, findScript} = debug.Debug

assertVanish = (thing, timeout, options = {}) ->
  weakAssertVanish new WeakPointer(thing), timeout, options

weakAssertVanish = (weakPointer, timeout, options) ->
  setTimeout ->
    if thing = weakPointer.get()
      unless options.silent
        console.error "'#{flatStringify thing}' (type '#{thing?.constructor?.name}') is still alive!"
        printRefTree makeMirror thing
        throw "unfullfilled vanish assertion"
      options.callback? true, thing
    else
      options.callback? false, null
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
    flatjson = '{' + (for key of thing
      continue if thing.__lookupGetter__(key)?
      "'#{key}': #{simpleStringify thing[key], referencee}"
    ).join(', ') + '}'
    type = thing.constructor?.name or 'object'
    "#{type}#{if thing.name then " '#{thing.name}'" else ''} (#{flatjson})"

printRefTree = (mirror, indentLevel = 0, referencee, seenTree = [], seen = {}) ->
  referencers = mirror.referencedBy()
  if referencers.length is 0
    console.error "#{makeIndent indentLevel}NATIVE CAUSE: #{flatStringify mirror.value_, referencee}"
  for seenThing in seenTree when seenThing is mirror
    console.error "#{makeIndent indentLevel}cyclic"
    return
  if seen[mirror.handle_]
    console.error "#{makeIndent indentLevel}already seen"
    return
  seen[mirror.handle_] = true
  console.error "#{makeIndent indentLevel}#{flatStringify mirror.value_, referencee}"
  seenTree.push mirror
  for referencer in referencers
    printRefTree referencer, indentLevel + 1, mirror.value_, seenTree, seen
  seenTree.pop()

module.exports = assertVanish
module.exports.active = true
