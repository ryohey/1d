import { validateOptionWithName } from "./optionValidator"

export default {
  action: "select1",

  validateOptions: (opts) => {
    return validateOptionWithName(opts, ["target"])
  },

  perform: (state, com) => {
    const [target] = com.options
    state.deselectAll()
    state.select(target)
  }
}
