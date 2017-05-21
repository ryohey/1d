import { validateOptionWithName } from "./optionValidator"
import { InvalidStateError } from "../Error.js"
import TextShape from "../Shape/TextShape"

export default {
  action: "fontFamily",

  validateOptions: (opts) => {
    return validateOptionWithName(opts, ["fontFamily"])
  },

  perform: (state, com) => {
    const [ fontFamily ] = com.options

    const shapes = state.targetShapes(com)
    if (shapes.length === 0) {
      return InvalidStateError("no shapes to change font size")
    }

    shapes.forEach(shape => {
      if (!(shape instanceof TextShape)) {
        return InvalidStateError("the shape is not TextShape")
      }
      shape.fontFamily = fontFamily
    })
  }
}
