import { validateOptionWithName } from "./optionValidator"
import { InvalidStateError } from "../Error"
import { IPlugin } from "./IPlugin"

const NameCommand: IPlugin = {
  action: "name",

  validateOptions: opts => {
    return validateOptionWithName(opts, ["name"])
  },

  perform: (state, com) => {
    const [name] = com.options
    const targetShapes = state.targetShapes(com)

    if (targetShapes.length === 0) {
      return InvalidStateError("no shapes to name")
    }

    targetShapes[0].name = name

    return null
  }
}

export default NameCommand
