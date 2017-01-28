import _ from "lodash"

import RectShape from "../Shape/RectShape"
import PathShape from "../Shape/PathShape"
import GridShape from "../Shape/GridShape"
import CircleShape from "../Shape/CircleShape"
import { pointCopy, pointAdd, project } from "../helpers/point"

/**

text -> [parseCommands] -> commands -> [buildSVG] -> svg

*/

export default function renderCommand(text) {
  const commands = parseCommands(text)
  const brush = {
    stroke: undefined,
    fill: undefined
  }
  let pos = { x: 0, y: 0 }
  let selectedShape = null
  let transform = {
    scale: 1
  }
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
      rendered.push(shape.render(brush))
    }
    warn(!shape, "no shape to draw")
    console.log("draw shape", shape)
    brush.stroke = undefined
    brush.fill = undefined
    brush.shape = undefined
  }

  function lastShape() {
    return shapes[shapes.length - 1]
  }

  function currentShape() {
    return lastShape() || selectedShape
  }

  function move(p) {
    pos = pointAdd(pos, project(transform, p))
  }

  for (let com of commands) {
    console.log(`command ${com.action}`)
    const opts = com.options
    switch (com.action) {
      case "moveTo":
        pos = project(transform, {
          x: parseFloat(opts[0]),
          y: parseFloat(opts[1])
        })
        break
      case "move":
        move({
          x: parseFloat(opts[0]),
          y: parseFloat(opts[1])
        })
        break
      case "line": {
        let shape = currentShape()
        if (!(shape instanceof PathShape)) {
          shape = new PathShape()
          shape.path.push(pointCopy(pos))
          add(shape)
        }
        const path = shape.path
        move({
          x: parseFloat(opts[0]),
          y: parseFloat(opts[1])
        })
        path.push(pointCopy(pos))
        break }
      case "close": {
        const shape = currentShape()
        warn(!(shape instanceof PathShape), "invalid state: the shape is not PathShape")
        shape.closed = true
        break }
      case "rect": {
        const w = project(transform, parseFloat(opts[0]))
        const h = project(transform, parseFloat(opts[1]))
        add(new RectShape(pos, w, h))
        break }
      case "circle": {
        const radius = project(transform, parseFloat(opts[0]))
        add(new CircleShape(pos, radius))
        break }
      case "stroke": {
        warn(!currentShape(), "invalid state: no shapes to draw")
        brush.stroke = opts[0]
        draw()
        break }
      case "fill": {
        warn(!currentShape(), "invalid state: no shapes to draw")
        brush.fill = opts[0]
        draw()
        break }
      case "grid": {
        const scale = parseFloat(opts[0])
        add(new GridShape({x: 0, y: 0}, scale))
        transform.scale = scale
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
        newShape.pos = pointCopy(pos)
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
