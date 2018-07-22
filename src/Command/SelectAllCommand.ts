import { IPlugin } from "./IPlugin"

const SelectAllCommand: IPlugin = {
  action: "selectAll",

  perform: (state, com) => {
    const { shapes } = state
    shapes.forEach(shape => (shape.selected = true))
    return null
  }
}

export default SelectAllCommand
