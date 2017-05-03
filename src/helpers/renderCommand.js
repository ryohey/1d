import _ from "lodash"

import PathShape from "../Shape/PathShape"
import { pointCopy, pointAdd, project } from "../helpers/point"
import { InvalidStateError, InvalidCommandError } from "../Command/Error.js"
import copyCommand from "../Command/CopyCommand"
import rectCommand from "../Command/RectCommand"
import moveCommand from "../Command/MoveCommand"
import moveToCommand from "../Command/MoveToCommand"
import lineCommand from "../Command/LineCommand"
import lineToCommand from "../Command/LineToCommand"
import closeCommand from "../Command/CloseCommand"
import circleCommand from "../Command/CircleCommand"
import textCommand from "../Command/TextCommand"
import translateCommand from "../Command/TranslateCommand"
import strokeCommand from "../Command/StrokeCommand"
import curveToCommand from "../Command/CurveToCommand"
import gridCommand from "../Command/GridCommand"
import TextShape from "../Shape/TextShape"

const plugins = [
  rectCommand,
  copyCommand,
  moveCommand,
  moveToCommand,
  lineCommand,
  lineToCommand,
  closeCommand,
  circleCommand,
  textCommand,
  translateCommand,
  strokeCommand,
  curveToCommand,
  gridCommand
]

class State {
  get lastShape() {
    return this.shapes[this.shapes.length - 1]
  }

  get selectedShapes() {
    return this.shapes.filter(s => s.selected)
  }

  get currentShapes() {
    const selected = this.selectedShapes
    if (selected.length > 0) {
      return selected
    }
    return [this.lastShape]
  }

  get currentShape() {
    return this.currentShapes[0]
  }

  targetShapes(com) {
    const target = this.findShape(com.target)
    return target ? [target] : this.currentShapes
  }

  addShape(shape) {
    shape.id = this.lastId
    shape.mouseHandler = this.mouseHandler
    this.shapes.push(shape)
    this.deselectAll()
    shape.selected = true
    this.lastId++
  }

  findShape(nameOrId) {
    if (!nameOrId) {
      return
    }
    return this.shapes.filter(s => `${s.id}` === nameOrId || s.name === nameOrId)[0]
  }

  deselectAll() {
    this.shapes.forEach(s => s.selected = false)
  }

  move(x, y) {
    this.pos = pointAdd(this.pos, project(this.transform, { x, y }))
  }

  addPosToCurrentShapePath() {
    this.currentShape.path.push(pointCopy(this.pos))
  }

  preparePathShape() {
    let shape = this.currentShape
    if (!(shape instanceof PathShape)) {
      shape = new PathShape()
      this.addShape(shape)
      this.addPosToCurrentShapePath()
    }
  }

  smoothCurveTo(x, y, x1, y1) {
    const { transform, currentShape } = this
    this.preparePathShape()
    const p = project(transform, { x, y })
    const c = project(transform, { x: x1, y: y1 })
    this.move(x, y)
    currentShape.path.push({
      x: p.x, y: p.y,
      c,
      command: "smooth curveto",
      code: "S"
    })
  }

  ellipticalArc(x, y, rx, ry, xAxisRotation, largeArc, sweep) {
    const { transform, currentShape } = this
    this.preparePathShape()
    const p = project(transform, { x, y })
    const r = project(transform, { x: rx, y: ry })
    this.move(x, y)
    currentShape.path.push({
      x: p.x, y: p.y,
      r,
      xAxisRotation, largeArc, sweep,
      command: "elliptical arc",
      code: "A"
    })
  }

  translateTo(shape, x, y) {
    const { transform } = this
    shape.pos = project(transform, { x, y })
  }

  resize(shape, x, y, ax, ay) {
    const { transform } = this
    const anchor = {
      x: _.isNil(ax) ? 0.5 : ax,
      y: _.isNil(ay) ? 0.5 : ay
    }

    shape.resize(project(transform, { x, y }), anchor)
  }

  select(nameOrId) {
    const found = this.findShape(nameOrId)
    if (!found) {
      return InvalidStateError("no shapes to select")
    }
    found.selected = true
  }
}

export default function renderCommand(text, mouseHandler) {
  const state = new State()
  state.lastId = 0
  state.pos = { x: 0, y: 0 }
  state.transform = {
    scale: 1
  }
  state.shapes = []
  state.mouseHandler = mouseHandler

  function warn(value, message) {
    if (value) {
      console.warn(message)
    }
  }

  const commands = parseCommands(text)

  for (let com of commands) {
    const { transform, shapes, currentShapes } = state
    const opts = com.options
    const target = state.findShape(com.target)
    const targetShapes = target ? [target] : currentShapes
    const shape = targetShapes[0]
    let error

    const plugin = _.find(plugins, p => p.action === com.action)
    if (plugin) {
      error = plugin.validateOptions(opts)
      if (!error) {
        error = plugin.perform(state, com)
      }
    }

    // コマンドを解釈して適切な関数を呼ぶ
    switch (com.action) {
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
        state.select(opts[0])
        break
      case "select1":
        if (opts.length === 0) {
          error = InvalidCommandError("target not specified")
          break
        }
        state.deselectAll()
        state.select(opts[0])
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
          state.translateTo(shape, opts[0], opts[1]))
        break
      case "resize":
        if (opts.length < 2) {
          error = InvalidCommandError("insufficient parameters")
          break
        }
        targetShapes.forEach(shape =>
          state.resize(shape, opts[0], opts[1], opts[2], opts[3]))
        break
      default:
        if (!plugin) {
          error = InvalidCommandError(`unknown action: ${com.action}`)
        }
        break
    }

    if (error) {
      if (!plugin) {
        console.warn(`error: ${error.message} for action "${com.action}" at line ${com.lineNumber}`)
      }
    }
  }

  return state.shapes
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
