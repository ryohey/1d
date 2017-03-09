import { validateOptionWithName } from "./optionValidator"

export default {
  action: "move",

  validateOptions: (opts) => {
    return validateOptionWithName(opts, ["x", "y"])
  },

  perform: (state, com) => {
    state.move(com.options[0], com.options[1])
  }
}
