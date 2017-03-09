import { validateOptionWithName } from "./optionValidator"
import { project } from "../helpers/point"
import RectShape from "../Shape/RectShape"

export default {
  action: "rect",

  validateOptions: (opts) => {
    return validateOptionWithName(opts, ["width", "height"])
  },

  perform: (state, com) => {
    const opts = com.options
    const w = project(state.transform, opts[0])
    const h = project(state.transform, opts[1])
    state.addShape(new RectShape(state.pos, w, h))
  }
}
