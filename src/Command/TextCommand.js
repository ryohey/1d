import { validateOptionWithName } from "./optionValidator"
import TextShape from "../Shape/TextShape"

export default {
  action: "text",

  validateOptions: (opts) => {
    return validateOptionWithName(opts, ["text"])
  },

  perform: (state, com) => {
    // remove quotes
    const text = com.options[0].replace(/^"(.+)"$/, "$1")
    state.addShape(new TextShape(state.pos, text))
  }
}
