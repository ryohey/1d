import { InvalidStateError } from "../Error.js"

export default {
  action: "selectAll",

  perform: (state, com) => {
    const { shapes } = state
    shapes.forEach(shape => shape.selected = true)
  }
}
