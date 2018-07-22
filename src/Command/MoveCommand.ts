import { validateOptionWithName } from "./optionValidator"
import { IPlugin } from "./IPlugin"

const MoveCommand: IPlugin = {
  action: "move",

  validateOptions: opts => {
    return validateOptionWithName(opts, ["x", "y"])
  },

  perform: (state, com) => {
    state.move(com.options[0], com.options[1])
    return null
  }
}

export default MoveCommand
