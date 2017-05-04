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
import translateToCommand from "../Command/TranslateToCommand"
import strokeCommand from "../Command/StrokeCommand"
import curveToCommand from "../Command/CurveToCommand"
import gridCommand from "../Command/GridCommand"
import resizeCommand from "../Command/ResizeCommand"
import fontSizeCommand from "../Command/FontSizeCommand"
import fillCommand from "../Command/FillCommand"
import strokeWidthCommand from "../Command/StrokeWidthCommand"
import nameCommand from "../Command/NameCommand"
import selectCommand from "../Command/SelectCommand"
import smoothCurveToCommand from "../Command/SmoothCurveToCommand"

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
  fontSizeCommand,
  translateCommand,
  translateToCommand,
  strokeCommand,
  curveToCommand,
  gridCommand,
  resizeCommand,
  fillCommand,
  strokeWidthCommand,
  nameCommand,
  selectCommand,
  smoothCurveToCommand
]

/**
 コマンド実行中に生成された Shape などの状態を
 コマンドをまたいで利用する処理などをまとめる
 */
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

  const commands = parseCommands(text)

  for (let com of commands) {
    const opts = com.options
    let error

    // コマンドに対応する plugin を探してコマンドを実行する
    const plugin = _.find(plugins, p => p.action === com.action)
    if (plugin) {
      error = plugin.validateOptions(opts)
      if (!error) {
        error = plugin.perform(state, com)
      }
    } else {
      error = InvalidCommandError(`unknown action: ${com.action}`)
    }

    if (error) {
      console.warn(`error: ${error.message} for action "${com.action}" at line ${com.lineNumber}`)
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
