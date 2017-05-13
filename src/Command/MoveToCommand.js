import { validateOptionWithName } from "./optionValidator"
import { project } from "../helpers/point"

export default {
  action: "moveTo",

  validateOptions: (opts) => {
    return validateOptionWithName(opts, ["x", "y"])
  },

  perform: (state, com) => {
    const [ x, y ] = com.options
    state.pos = project(state.transform, { x, y })
  }
}
