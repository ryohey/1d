import _ from "lodash"
import { validateOptionWithName } from "./optionValidator"
import { InvalidStateError, InvalidCommandError } from "../Error.js"

function getBoundsCenter(bounds) {
  return bounds.origin.x + bounds.size.x / 2
}

function getBoundsMiddle(bounds) {
  return bounds.origin.y + bounds.size.y / 2
}

function getBoundsRight(bounds) {
  return bounds.origin.x + bounds.size.x
}

function getBoundsBottom(bounds) {
  return bounds.origin.y + bounds.size.y
}

// shape の上端を指定した位置に設定する
function setOriginY(shape, y) {
  const anchorLocal = shape.pos.y - shape.bounds.origin.y
  shape.pos.y = y + anchorLocal
}

// shape の左端を指定した位置に設定する
function setOriginX(shape, x) {
  const anchorLocal = shape.pos.x - shape.bounds.origin.x
  shape.pos.x = x + anchorLocal
}

export default {
  action: "align",

  validateOptions: (opts) => {
    return validateOptionWithName(opts, ["type"])
  },

  perform: (state, com) => {
    const [type] = com.options

    const shapes = state.targetShapes(com)
    if (shapes.length === 0) {
      return InvalidStateError("no shapes to close path")
    }

    switch (type) {
      case "top":
      case "t": {
        const y = _.min(shapes.map(s => s.bounds.origin.y))
        shapes.forEach(s => setOriginY(s, y))
        break
      }

      case "bottom":
      case "b": {
        const bottom = _.max(shapes.map(s => getBoundsBottom(s.bounds)))
        shapes.forEach(s =>
          setOriginY(s, bottom - s.bounds.size.y))
        break
      }

      case "left":
      case "l": {
        const x = _.min(shapes.map(s => s.bounds.origin.x))
        shapes.forEach(s => setOriginX(s, x))
        break
      }

      case "right":
      case "r": {
        const right = _.max(shapes.map(s => getBoundsRight(s.bounds)))
        shapes.forEach(s =>
          setOriginX(s, right - s.bounds.size.x))
        break
      }

      case "center":
      case "c":
      case "x": {
        const center = _.sum(shapes.map(s => getBoundsCenter(s.bounds))) / shapes.length
        shapes.forEach(s =>
          setOriginX(s, center - s.size.x / 2))
        break
      }

      case "middle":
      case "m":
      case "y": {
        const middle = _.sum(shapes.map(s => getBoundsMiddle(s.bounds))) / shapes.length
        shapes.forEach(s => {
          console.log(s.bounds.size.y)
          setOriginY(s, middle - s.bounds.size.y / 2)
        })
        break
      }

      default:
        return InvalidCommandError(`unknown type: ${type}`)
    }
  }
}
