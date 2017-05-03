import { validateOptionWithName } from "./optionValidator"

export default {
  action: "select",

  validateOptions: (opts) => {
    return validateOptionWithName(opts, ["target"])
  },

  perform: (state, com) => {
    const [target] = com.options
    state.select(target)
  }
}
