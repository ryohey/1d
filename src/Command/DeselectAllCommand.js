import { InvalidCommandError } from "../Error.js"

export default {
  action: "deselectAll",

  validateOptions: (opts) => {
    if (opts.length !== 0) {
      return InvalidCommandError("options not allowed")
    }
  },

  perform: (state, com) => {
    state.deselectAll()
  }
}
