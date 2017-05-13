import { validateOptionWithName } from "./optionValidator"
import { project } from "../helpers/point"

export default {
  action: "lineTo",

  validateOptions: (opts) => {
    return validateOptionWithName(opts, ["x", "y"])
  },

  perform: (state, com) => {
    const [ x, y ] = com.options
    state.preparePathShape()
    state.pos = project(state.transform, { x, y })
    state.addPosToCurrentShapePath()
  }
}
