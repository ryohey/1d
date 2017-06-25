import _ from "lodash"
import { Point } from "paper"
import { validateOptionWithName } from "./optionValidator"
import { project } from "../helpers/point"

export default {
  action: "curveTo",

  validateOptions: (opts) => {
    return validateOptionWithName(opts, ["x", "y", "x1", "y1", "x2", "y2"])
  },

  perform: (state, com) => {
    const { transform } = state
    const [x, y, x1, y1, x2, y2] = com.options
    state.preparePathShape()
    const p = project(transform, new Point(x, y))
    const c1 = project(transform, new Point(x1, y1))
    const c2 = project(transform, new Point(x2, y2))
    state.pos = p
    state.currentShape.path.push({
      x: p.x,
      y: p.y,
      c1: c1.add(p),
      c2: c2.add(p),
      command: "curveto",
      code: "C"
    })
  }
}
