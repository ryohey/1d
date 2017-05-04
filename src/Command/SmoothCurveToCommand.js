import { validateOptionWithName } from "./optionValidator"
import { project } from "../helpers/point"

export default {
  action: "smoothCurveTo",

  validateOptions: (opts) => {
    return validateOptionWithName(opts, ["x", "y", "x1", "y1"])
  },

  perform: (state, com) => {
    const { transform, currentShape } = state
    const [ x, y, x1, y1] = com.options

    state.preparePathShape()
    const p = project(transform, { x, y })
    const c = project(transform, { x: x1, y: y1 })
    state.move(x, y)
    currentShape.path.push({
      x: p.x, y: p.y,
      c,
      command: "smooth curveto",
      code: "S"
    })
  }
}
