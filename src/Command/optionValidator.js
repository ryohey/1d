import { InvalidCommandError } from "../Error.js"

// オプションの数を検証する
export const validateOptionWithName = (options, optionNames) => {
  if (options.length === 0 && options.length < optionNames.length) {
    return InvalidCommandError(`insufficient parameters`)
  }
  for (let i in options) {
    if (options[i] === undefined) {
      return InvalidCommandError(`parameter ${optionNames[i]} not specified`)
    }
  }
  return null
}
