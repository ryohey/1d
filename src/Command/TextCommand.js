import { validateOptionWithName } from "./optionValidator"
import { InvalidCommandError } from "./Error.js"
import TextShape from "../Shape/TextShape"

export default {
  action: "circle",

  validateOptions: (opts) => {
    return validateOptionWithName(opts, ["text"])
  },

  perform: (state, com) => {
    // remove quotes
    const text = com.options[0].replace(/^"(.+)"$/, "$1")
    state.add(new TextShape(state.pos, text))
  }
}
