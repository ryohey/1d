import _ from "lodash"

import RectShape from "../Shape/RectShape"
import PathShape from "../Shape/PathShape"
import GridShape from "../Shape/GridShape"
import CircleShape from "../Shape/CircleShape"
import TextShape from "../Shape/TextShape"
import { pointCopy, pointAdd, project } from "../helpers/point"

function InvalidStateError(message) {
  return new Error(`invalid state error: ${message}`)
}

function InvalidCommandError(message) {
  return new Error(`invalid command error: ${message}`)
}

export default function renderCommand(text, mouseHandler) {
  const commands = parseCommands(text)
  let lastId = 0
  let pos = { x: 0, y: 0 }
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
    shape.id = lastId
    shape.mouseHandler = mouseHandler
    shapes.push(shape)
    deselectAll()
    shape.selected = true
    lastId++
  }

  function lastShape() {
    return shapes[shapes.length - 1]
  }

  function selectedShapes() {
    return shapes.filter(s => s.selected)
  }

  function currentShapes() {
    const selected = selectedShapes()
    if (selected.length > 0) {
      return selected
    }
    return [lastShape()]
  }

  function currentShape() {
    return currentShapes()[0]
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

  function curveTo(x, y, x1, y1, x2, y2) {
    preparePathShape()
    const p = project(transform, { x, y })
    const c1 = project(transform, { x: x1, y: y1 })
    const c2 = project(transform, { x: x2, y: y2 })
    move(x, y)
    currentShape().path.push({
      x: p.x, y: p.y,
      c1, c2,
      command: "curveto",
      code: "C"
    })
  }

  function smoothCurveTo(x, y, x1, y1) {
    preparePathShape()
    const p = project(transform, { x, y })
    const c = project(transform, { x: x1, y: y1 })
    move(x, y)
    currentShape().path.push({
      x: p.x, y: p.y,
      c,
      command: "smooth curveto",
      code: "S"
    })
  }

  function ellipticalArc(x, y, rx, ry, xAxisRotation, largeArc, sweep) {
    preparePathShape()
    const p = project(transform, { x, y })
    const r = project(transform, { x: rx, y: ry })
    move(x, y)
    currentShape().path.push({
      x: p.x, y: p.y,
      r,
      xAxisRotation, largeArc, sweep,
      command: "elliptical arc",
      code: "A"
    })
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

  const pluralify = (func) => () =>
    shapes.map(s => func(s, ..._.tail(arguments)))

  function translateTo(shape, x, y) {
    shape.pos = project(transform, { x, y })
  }

  function resize(shape, x, y, ax, ay) {
    const anchor = {
      x: _.isNil(ax) ? 0.5 : ax,
      y: _.isNil(ay) ? 0.5 : ay
    }

    shape.resize(project(transform, { x, y }), anchor)
  }

  function deselectAll() {
    shapes.forEach(s => s.selected = false)
  }

  function select(nameOrId) {
    const found = findShape(nameOrId)
    warn(!found, "invalid state: no shapes to select")
    found.selected = true
  }

  for (let com of commands) {
    const opts = com.options
    const target = findShape(com.target)
    const targetShapes = target ? [target] : currentShapes()
    const shape = targetShapes[0]
    let error

    // コマンドを解釈して適切な関数を呼ぶ
    switch (com.action) {
      case "moveTo":
        if (opts.length !== 2) {
          error = InvalidCommandError("insufficient parameters")
          break
        }
        moveTo(opts[0], opts[1])
        break
      case "move":
        if (opts.length !== 2) {
          error = InvalidCommandError("insufficient parameters")
          break
        }
        move(opts[0], opts[1])
        break
      case "lineTo":
        if (opts.length !== 2) {
          error = InvalidCommandError("insufficient parameters")
          break
        }
        lineTo(opts[0], opts[1])
        break
      case "line":
        if (opts.length !== 2) {
          error = InvalidCommandError("insufficient parameters")
          break
        }
        line(opts[0], opts[1])
        break
      case "curveTo":
        if (opts.length !== 6) {
          error = InvalidCommandError("insufficient parameters")
          break
        }
        curveTo(opts[0], opts[1], opts[2], opts[3], opts[4], opts[5])
        break
      case "close":
        if (targetShapes.length === 0) {
          error = InvalidStateError("no shapes to close path")
          break
        }
        if (!(shape instanceof PathShape)) {
          error = InvalidStateError("the shape is not PathShape")
          break
        }
        shape.closed = true
        break
      case "rect": {
        if (opts[0] === undefined) {
          error = InvalidCommandError("width not specified")
          break
        }
        if (opts[1] === undefined) {
          error = InvalidCommandError("height not specified")
          break
        }
        const w = project(transform, opts[0])
        const h = project(transform, opts[1])
        add(new RectShape(pos, w, h))
        break }
      case "circle": {
        if (opts.length === 0) {
          error = InvalidCommandError("rx not specified")
          break
        }
        const rx = project(transform, opts[0])
        const radius = { x: rx, y: rx }
        if (!_.isNil(opts[1])) {
          radius.y = project(transform, opts[1])
        }
        add(new CircleShape(pos, radius))
        break }
      case "text":{
        if (opts.length === 0) {
          error = InvalidCommandError("text not specified")
          break
        }
        // remove quotes
        const text = opts[0].replace(/^"(.+)"$/, "$1")
        add(new TextShape(pos, text))
        break}
      case "stroke":
        if (targetShapes.length === 0) {
          error = InvalidStateError("no shapes to change stroke color")
          break
        }
        targetShapes.forEach(shape =>
          shape.brush.stroke = opts[0])
        break
      case "fill":
        if (targetShapes.length === 0) {
          error = InvalidStateError("no shapes to change fill color")
          break
        }
        targetShapes.forEach(shape =>
          shape.brush.fill = opts[0])
        break
      case "strokeWidth":
        if (targetShapes.length === 0) {
          error = InvalidStateError("no shapes to change line width")
          break
        }
        targetShapes.forEach(shape =>
          shape.brush.strokeWidth = project(transform, opts[0]))
        break
      case "fontSize":
        if (targetShapes.length === 0) {
          error = InvalidStateError("no shapes to change font size")
          break
        }
        targetShapes.forEach(shape => {
          warn(!(shape instanceof TextShape), "invalid state: the shape is not TextShape")
          shape.fontSize = project(transform, opts[0])
        })
        break
      case "grid": {
        if (opts.length === 0) {
          error = InvalidCommandError("scale not specified")
          break
        }
        const scale = parseFloat(opts[0])
        add(new GridShape({x: 0, y: 0}, scale))
        transform.scale = scale
        break }
      case "name": {
        if (targetShapes.length === 0) {
          error = InvalidStateError("no shapes to name")
          break
        }
        shape.name = opts[0]
        break }
      case "select":
        if (opts.length === 0) {
          error = InvalidCommandError("target not specified")
          break
        }
        select(opts[0])
        break
      case "select1":
        if (opts.length === 0) {
          error = InvalidCommandError("target not specified")
          break
        }
        deselectAll()
        select(opts[0])
        break
      case "translate":
        if (targetShapes.length === 0) {
          error = InvalidStateError("no shapes to translate")
          break
        }
        if (opts[0] === undefined) {
          error = InvalidCommandError("x not specified")
          break
        }
        if (opts[1] === undefined) {
          error = InvalidCommandError("y not specified")
          break
        }
        targetShapes.forEach(shape =>
          translate(shape, opts[0], opts[1]))
        break
      case "translateTo":
        if (targetShapes.length === 0) {
          error = InvalidStateError("no shapes to apply translateTo")
          break
        }
        if (opts[0] === undefined) {
          error = InvalidCommandError("x not specified")
          break
        }
        if (opts[1] === undefined) {
          error = InvalidCommandError("y not specified")
          break
        }
        targetShapes.forEach(shape =>
          translateTo(shape, opts[0], opts[1]))
        break
      case "copy":
        if (targetShapes.length === 0) {
          error = InvalidStateError("no shapes to copy")
          break
        }
        copy(shape)
        break
      case "resize":
        if (opts.length < 2) {
          error = InvalidCommandError("insufficient parameters")
          break
        }
        targetShapes.forEach(shape =>
          resize(shape, opts[0], opts[1], opts[2], opts[3]))
        break
      default:
        error = InvalidCommandError(`unknown action: ${com.action}`)
        break
    }

    if (error) {
      console.warn(`error: ${error.message} for action "${com.action}" at line ${com.lineNumber}`)
    }
  }

  return shapes
}

/**
  parse text to command objects
*/
function parseCommands(text) {
  const list = []
  text.split("\n").forEach((line, lineNumber) => {
    if (line.length === 0) {
      return
    }

    const words = line.match(/[^\s"']+|"([^"]*)"|'([^']*)'/g)
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

    list.push({ target, action, options, lineNumber })
  })
  return list
}
