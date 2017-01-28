import _ from "lodash"

import RectShape from "../Shape/RectShape"
import PathShape from "../Shape/PathShape"
import GridShape from "../Shape/GridShape"
import CircleShape from "../Shape/CircleShape"
import { pointCopy } from "../helpers/point"

/**

text -> [parseCommands] -> commands -> [buildSVG] -> svg

*/

export default function renderCommand(text) {
  const commands = parseCommands(text)
  const ctx = {
    pos: { x: 0, y: 0 },
    stroke: undefined,
    fill: undefined,
    scale: 1
  }
  let selectedShape = null
  const shapes = []
  const rendered = []

  function warn(value, message) {
    if (value) {
      console.warn(message)
    }
  }

  function add(shape) {
    shapes.push(shape)
    console.log("shape added", shape)
    selectedShape = null
  }

  function draw() {
    const shape = currentShape()
    if (shape) {
      rendered.push(shape.render(ctx))
    }
    warn(!shape, "no shape to draw")
    console.log("draw shape", shape)
    ctx.stroke = undefined
    ctx.fill = undefined
    ctx.shape = undefined
  }

  function lastShape() {
    return shapes[shapes.length - 1]
  }

  function currentShape() {
    return lastShape() || selectedShape
  }

  for (let com of commands) {
    console.log(`command ${com.action}`)
    const opts = com.options
    switch (com.action) {
      case "moveTo":
        ctx.pos.x = parseFloat(opts[0])
        ctx.pos.y = parseFloat(opts[1])
        break
      case "move":
        ctx.pos.x += parseFloat(opts[0])
        ctx.pos.y += parseFloat(opts[1])
        break
      case "line": {
        let shape = currentShape()
        if (!(shape instanceof PathShape)) {
          shape = new PathShape()
          shape.path.push({
            x: ctx.pos.x,
            y: ctx.pos.y
          })
          add(shape)
        }
        const path = shape.path
        ctx.pos.x += parseFloat(opts[0])
        ctx.pos.y += parseFloat(opts[1])
        path.push({
          x: ctx.pos.x,
          y: ctx.pos.y
        })
        break }
      case "close": {
        const shape = currentShape()
        warn(!(shape instanceof PathShape), "invalid state: the shape is not PathShape")
        shape.closed = true
        break }
      case "rect": {
        add(new RectShape(ctx.pos, parseFloat(opts[0]), parseFloat(opts[1])))
        break }
      case "circle": {
        add(new CircleShape(ctx.pos, parseFloat(opts[0])))
        break }
      case "stroke": {
        warn(!currentShape(), "invalid state: no shapes to draw")
        ctx.stroke = opts[0]
        draw()
        break }
      case "fill": {
        warn(!currentShape(), "invalid state: no shapes to draw")
        ctx.fill = opts[0]
        draw()
        break }
      case "grid": {
        const scale = parseFloat(opts[0])
        add(new GridShape({x: 0, y: 0}, scale))
        ctx.scale = scale
        break }
      case "name": {
        const shape = currentShape()
        warn(!shape, "invalid state: no shapes to name")
        shape.name = opts[0]
        break }
      case "select": {
        const shape = currentShape()
        warn(!shape, "invalid state: no shapes to select")
        selectedShape = shape
        break }
      case "copy": {
        const shape = currentShape()
        warn(!shape, "invalid state: no shapes to copy")
        const newShape = shape.clone()
        add(newShape)
        newShape.pos = pointCopy(ctx.pos)
        break }
      default:
        warn(true, `unknown action: ${com.action}`)
    }
  }

  return rendered
}

/**
  convert commands to display objects
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

    if (words[0].startsWith("@") && words.length > 2) {
      target = _.tail(words[0])
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
