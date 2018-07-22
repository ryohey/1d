import { InvalidCommandError } from "../Error"
import { IPlugin } from "./IPlugin"

const SelectCommand: IPlugin = {
  action: "select",

  validateOptions: opts => {
    if (opts.length === 0) {
      return InvalidCommandError("target not specified")
    }
    return null
  },

  perform: (state, com) => {
    com.options.forEach(t => state.select(t))
    return null
  }
}

export default SelectCommand
