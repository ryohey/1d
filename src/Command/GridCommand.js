import { validateOptionWithName } from "./optionValidator"
import GridShape from "../Shape/GridShape"

export default {
  action: "grid",

  validateOptions: (opts) => {
    return validateOptionWithName(opts, ["scale"])
  },

  perform: (state, com) => {
    const { transform } = state
    const scale = parseFloat(com.options[0])
    state.addShape(new GridShape({x: 0, y: 0}, scale))
    transform.scale = scale
  }
}
