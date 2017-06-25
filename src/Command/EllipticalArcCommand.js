import { Point } from "paper"
import { validateOptionWithName } from "./optionValidator"
import { project } from "../helpers/point"

export default {
  action: "ellipticalArc",

  validateOptions: (opts) => {
    return validateOptionWithName(opts, ["x", "y", "rx", "ry", "xAxisRotation", "largeArc", "sweep"])
  },

  perform: (state, com) => {
    const { transform, currentShape } = state
    const [ x, y, rx, ry, xAxisRotation, largeArc, sweep ] = com.options

    state.preparePathShape()
    const p = project(transform, new Point(x, y))
    const r = project(transform, new Point(rx, ry))
    state.move(x, y)
    currentShape.path.push({
      x: p.x, y: p.y,
      r,
      xAxisRotation, largeArc, sweep,
      command: "elliptical arc",
      code: "A"
    })
  }
}
