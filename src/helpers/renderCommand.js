import _ from "lodash"

import RectShape from "../Shape/RectShape"
import PathShape from "../Shape/PathShape"
import GridShape from "../Shape/GridShape"
import CircleShape from "../Shape/CircleShape"
import { pointCopy, pointAdd, project } from "../helpers/point"

export default function renderCommand(text, mouseHandler) {
  const commands = parseCommands(text)
  let lastId = 0
  let pos = { x: 0, y: 0 }
  let selectedShape = null
  let transform = {
    scale: 1
  }
  const shapes = []

  function warn(value, message) {
    if (value) {
      console.warn(message)
    }
  }

  function add(shape) {
    console.log("add", lastId)
    shape.id = lastId
    shape.mouseHandler = mouseHandler
    shapes.push(shape)
    console.log("shape added", shape)
    selectedShape = null
    lastId++
  }

  function lastShape() {
    return shapes[shapes.length - 1]
  }

  function currentShape() {
    return selectedShape || lastShape()
  }

  function moveTo(x, y) {
    pos = project(transform, { x, y })
  }

  function move(x, y) {
    pos = pointAdd(pos, project(transform, { x, y }))
  }

  function addPosToCurrentShapePath() {
    currentShape().path.push(pointCopy(pos))
  }

  function preparePathShape() {
    let shape = currentShape()
    if (!(shape instanceof PathShape)) {
      shape = new PathShape()
      add(shape)
      addPosToCurrentShapePath()
    }
  }

  function lineTo(x, y) {
    preparePathShape()
    moveTo(x, y)
    addPosToCurrentShapePath()
  }

  function line(x, y) {
    preparePathShape()
    move(x, y)
    addPosToCurrentShapePath()
  }

  function copy(shape) {
    warn(!shape, "invalid state: no shapes to copy")
    const newShape = shape.clone()
    add(newShape)
    newShape.pos = pointCopy(pos)
  }

  function findShape(nameOrId) {
    if (!nameOrId) {
      return
    }
    return shapes.filter(s => `${s.id}` === nameOrId || s.name === nameOrId)[0]
  }

  function translate(shape, x, y) {
    shape.pos = pointAdd(shape.pos, project(transform, { x, y }))
  }

  function translateTo(shape, x, y) {
    shape.pos = project(transform, { x, y })
  }

  function resize(shape, x, y) {
    shape.resize(project(transform, { x, y }))
  }

  for (let com of commands) {
    console.log(`command ${com.action}`)
    const opts = com.options
    const shape = findShape(com.target) || currentShape()

    // コマンドを解釈して適切な関数を呼ぶ
    switch (com.action) {
      case "moveTo":
        moveTo(opts[0], opts[1])
        break
      case "move":
        move(opts[0], opts[1])
        break
      case "lineTo":
        lineTo(opts[0], opts[1])
        break
      case "line":
        line(opts[0], opts[1])
        break
      case "close":
        warn(!(shape instanceof PathShape), "invalid state: the shape is not PathShape")
        shape.closed = true
        break
      case "rect": {
        const w = project(transform, opts[0])
        const h = project(transform, opts[1])
        add(new RectShape(pos, w, h))
        break }
      case "circle": {
        const radius = project(transform, opts[0])
        add(new CircleShape(pos, radius))
        break }
      case "stroke":
        warn(!shape, "invalid state: no shapes to change stroke color")
        shape.brush.stroke = opts[0]
        break
      case "fill":
        warn(!shape, "invalid state: no shapes to change fill color")
        shape.brush.fill = opts[0]
        break
      case "strokeWidth":
        warn(!shape, "invalid state: no shapes to change line width")
        shape.brush.strokeWidth = project(transform, opts[0])
        break
      case "grid": {
        const scale = parseFloat(opts[0])
        add(new GridShape({x: 0, y: 0}, scale))
        transform.scale = scale
        break }
      case "name": {
        warn(!shape, "invalid state: no shapes to name")
        shape.name = opts[0]
        break }
      case "select":
        const nameOrId = opts[0]
        const found = findShape(nameOrId) || shape
        warn(!found, "invalid state: no shapes to select")
        selectedShape = found
        break
      case "translate":
        translate(shape, opts[0], opts[1])
        break
      case "translateTo":
        translateTo(shape, opts[0], opts[1])
        break
      case "copy":
        copy(shape)
        break
      case "resize":
        resize(shape, opts[0], opts[1])
        break
      default:
        warn(true, `unknown action: ${com.action}`)
        break
    }
  }

  // add selected property to shapes
  shapes.forEach(s => {
    s.selected = s === selectedShape
  })

  return shapes
}

/**
  parse text to command objects
*/
function parseCommands(text) {
  const list = []
  for (let line of text.split("\n")) {
    if (line.length === 0) {
      continue
    }

    const words = line.split(" ")
    let target = null
    let action
    let options

    if (words[0].startsWith("@") && words.length > 1) {
      target = words[0].slice(1, words[0].length)
      action = words[1]
      options = words.slice(2, words.length)
    } else {
      action = words[0]
      options = _.tail(words)
    }

    list.push({ target, action, options })
  }
  return list
}
