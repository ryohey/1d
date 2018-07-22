import { InvalidCommandError } from "../Error"
import { IPlugin } from "./IPlugin"

const DeselectAllCommand: IPlugin = {
  action: "deselectAll",

  validateOptions: opts => {
    if (opts.length !== 0) {
      return InvalidCommandError("options not allowed")
    }
    return null
  },

  perform: (state, com) => {
    state.deselectAll()
    return null
  }
}

export default DeselectAllCommand
