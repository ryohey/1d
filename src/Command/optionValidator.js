import { InvalidCommandError } from "../Error.js"

// オプションの数を検証する
export const validateOptionWithName = (options, optionNames) => {
  for (let i in optionNames) {
    if (options[i] === undefined) {
      return InvalidCommandError(`parameter ${optionNames[i]} not specified`)
    }
  }
  return null
}
