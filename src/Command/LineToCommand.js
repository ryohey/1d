import { validateOptionWithName } from "./optionValidator"

export default {
  action: "lineTo",

  validateOptions: (opts) => {
    return validateOptionWithName(opts, ["x", "y"])
  },

  perform: (state, com) => {
    state.preparePathShape()
    state.moveTo(com.options[0], com.options[1])
    state.addPosToCurrentShapePath()
  }
}
