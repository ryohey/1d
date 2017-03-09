import { validateOptionWithName } from "./optionValidator"
import { project } from "../helpers/point"

export default {
  action: "moveTo",

  validateOptions: (opts) => {
    return validateOptionWithName(opts, ["x", "y"])
  },

  perform: (state, com) => {
    const x = com.options[0]
    const y = com.options[1]
    state.pos = project(state.transform, { x, y })
  }
}
