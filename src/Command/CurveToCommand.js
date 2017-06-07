import _ from "lodash"
import { validateOptionWithName } from "./optionValidator"
import { project, pointAdd } from "../helpers/point"

export default {
  action: "curveTo",

  validateOptions: (opts) => {
    return validateOptionWithName(opts, ["x", "y", "x1", "y1", "x2", "y2"])
  },

  perform: (state, com) => {
    const { transform } = state
    const [x, y, x1, y1, x2, y2] = com.options
    state.preparePathShape()
    const p = project(transform, { x, y })
    const c1 = project(transform, { x: x1, y: y1 })
    const c2 = project(transform, { x: x2, y: y2 })
    state.pos = p
    state.currentShape.path.push({
      x: p.x,
      y: p.y,
      c1: pointAdd(c1, p),
      c2: pointAdd(c2, p),
      command: "curveto",
      code: "C"
    })
  }
}
