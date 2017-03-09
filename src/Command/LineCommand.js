import { validateOptionWithName } from "./optionValidator"

export default {
  action: "line",

  validateOptions: (opts) => {
    return validateOptionWithName(opts, ["x", "y"])
  },

  perform: (state, com) => {
    state.preparePathShape()
    state.move(com.options[0], com.options[1])
    state.addPosToCurrentShapePath()
  }
}
