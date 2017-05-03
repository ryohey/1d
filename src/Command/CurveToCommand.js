import _ from "lodash"
import { InvalidCommandError } from "./Error.js"
import { project } from "../helpers/point"

export default {
  action: "curveTo",

  validateOptions: (opts) => {
    if (opts.length === 6) {
      return InvalidCommandError("insufficient parameters")
    }
  },

  perform: (state, com) => {
    const { transform, currentShape } = state
    const [x, y, x1, y1, x2, y2] = com.options
    state.preparePathShape()
    const p = project(transform, { x, y })
    const c1 = project(transform, { x: x1, y: y1 })
    const c2 = project(transform, { x: x2, y: y2 })
    state.move(x, y)
    currentShape.path.push({
      x: p.x, y: p.y,
      c1, c2,
      command: "curveto",
      code: "C"
    })
  }
}
