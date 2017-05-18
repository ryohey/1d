import { InvalidStateError } from "../Error.js"
import TextShape from "../Shape/TextShape"

export default {
  action: "changeText",

  perform: (state, com) => {
    const [ text ] = com.options
    const shapes = state.targetShapes(com)

    if (shapes.length === 0) {
      return InvalidStateError("no shapes to change text")
    }

    shapes.forEach(shape => {
      if (!(shape instanceof TextShape)) {
        return InvalidStateError("the shape is not TextShape")
      }
      shape.text = text
    })
  }
}
