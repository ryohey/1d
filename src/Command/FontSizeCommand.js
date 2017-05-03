import { validateOptionWithName } from "./optionValidator"
import { InvalidStateError } from "./Error.js"
import { project } from "../helpers/point"
import TextShape from "../Shape/TextShape"

export default {
  action: "fontSize",

  validateOptions: (opts) => {
    return validateOptionWithName(opts, ["fontSize"])
  },

  perform: (state, com) => {
    const [fontSize] = com.options
    const { transform } = state

    const targetShapes = state.targetShapes(com)
    if (targetShapes.length === 0) {
      return InvalidStateError("no shapes to change font size")
    }

    targetShapes.forEach(shape => {
      if (!(shape instanceof TextShape)) {
        return InvalidStateError("the shape is not TextShape")
      }
      shape.fontSize = project(transform, fontSize)
    })
  }
}
