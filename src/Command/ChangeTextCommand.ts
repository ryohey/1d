import { InvalidStateError } from "../Error"
import TextShape from "../Shape/TextShape"
import { IPlugin } from "./IPlugin"

const ChangeTextCommand: IPlugin = {
  action: "changeText",

  perform: (state, com) => {
    const [text] = com.options
    const shapes = state.targetShapes(com)

    if (shapes.length === 0) {
      return InvalidStateError("no shapes to change text")
    }

    for (const shape of shapes) {
      if (!(shape instanceof TextShape)) {
        return InvalidStateError("the shape is not TextShape")
      }
      shape.text = text
    }

    return null
  }
}

export default ChangeTextCommand
