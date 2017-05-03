import { InvalidCommandError } from "./Error.js"
import { project } from "../helpers/point"
import GridShape from "../Shape/GridShape"

export default {
  action: "grid",

  validateOptions: (opts) => {
    if (opts.length === 0) {
      return InvalidCommandError("scale not specified")
    }
  },

  perform: (state, com) => {
    const { transform } = state
    const scale = parseFloat(com.options[0])
    state.addShape(new GridShape({x: 0, y: 0}, scale))
    transform.scale = scale
  }
}
