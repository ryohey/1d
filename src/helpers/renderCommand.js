import _ from "lodash"

import RectShape from "../Shape/RectShape"
import PathShape from "../Shape/PathShape"
import GridShape from "../Shape/GridShape"
import CircleShape from "../Shape/CircleShape"
import { pointCopy } from "../helpers/point"

/**

text -> [parseCommands] -> commands -> [buildSVG] -> svg

*/

function warn(value, message) {
  if (value) {
    console.warn(message)
  }
}

export default function renderCommand(text) {
  const commands = parseCommands(text)
  const ctx = {
    pos: { x: 0, y: 0 },
    shape: undefined,
    selectedShape: undefined,
    stroke: undefined,
    fill: undefined,
    scale: 1,
    namedShapes: {} // {String: Shape}
  }
  const svg = []

  function add(element) {
    svg.push(element)
  }

  function draw() {
    add(ctx.shape.render(ctx))
    ctx.selectedShape = ctx.shape
    ctx.stroke = undefined
    ctx.fill = undefined
    ctx.shape = undefined
  }

  for (let com of commands) {
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
      case "line":
        if (!ctx.shape) {
          ctx.shape = new PathShape()
          ctx.shape.path.push({
            x: ctx.pos.x,
            y: ctx.pos.y
          })
        }
        warn(!(ctx.shape instanceof PathShape), "invalid state: the shape is not PathShape")
        const path = ctx.shape.path
        ctx.pos.x += parseFloat(opts[0])
        ctx.pos.y += parseFloat(opts[1])
        path.push({
          x: ctx.pos.x,
          y: ctx.pos.y
        })
        break
      case "close":
        warn(!(ctx.shape instanceof PathShape), "invalid state: the shape is not PathShape")
        ctx.shape.closed = true
        break
      case "rect":
        warn(ctx.shape, "invalid state: context already has a shape")
        ctx.shape = new RectShape(ctx.pos, parseFloat(opts[0]), parseFloat(opts[1]))
        break
      case "circle":
        warn(ctx.shape, "invalid state: context already has a shape")
        ctx.shape = new CircleShape(ctx.pos, parseFloat(opts[0]))
        break
      case "stroke":
        warn(!ctx.shape, "invalid state: no shapes to draw")
        ctx.stroke = opts[0]
        draw()
        break
      case "fill":
        warn(!ctx.shape, "invalid state: no shapes to draw")
        ctx.fill = opts[0]
        draw()
        break
      case "grid":
        const scale = parseFloat(opts[0])
        ctx.shape = new GridShape({x: 0, y: 0}, scale)
        ctx.scale = scale
        break
      case "name":
        warn(!ctx.selectedShape, "invalid state: no shapes to name")
        ctx.namedShapes[opts[0]] = ctx.selectedShape.clone()
        break
      case "select":
        warn(!ctx.namedShapes[opts[0]], "invalid state: no shapes to select")
        ctx.selectedShape = ctx.namedShapes[opts[0]]
        break
      case "copy":
        warn(!ctx.selectedShape, "invalid state: no shapes to copy")
        ctx.shape = ctx.selectedShape.clone()
        ctx.shape.pos = pointCopy(ctx.pos)
        break
      default:
        warn(true, `unknown action: ${com.action}`)
    }
  }

  return svg
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
