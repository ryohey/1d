import { InvalidCommandError } from "../Error.js"

export default {
  action: "select",

  validateOptions: (opts) => {
    if (opts.length === 0) {
      return InvalidCommandError("target not specified")
    }
  },

  perform: (state, com) => {
    com.options.forEach(t => state.select(t))
  }
}
