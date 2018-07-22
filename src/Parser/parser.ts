import _ from "lodash"
import shlex from "../helpers/Shlex"
import { ICommand } from "./ICommand"
import { notEmpty } from "../helpers/typeHelper"

function cleanup(text: string) {
  return text.replace(/ +$/, "")
}

/**
  parse text to command objects

  Command: {
    action: String,
    target: String,
    options: [String],
    lineNumber: Number
  }
*/
export default function parseCommands(text: string): ICommand[] {
  return text
    .split("\n")
    .map((line, lineNumber) => {
      if (line.length === 0) {
        return null
      }

      const words = shlex(cleanup(line))
      let target: string | null = null
      let action
      let options

      if (words[0].startsWith("#") || words[0].startsWith("//")) {
        // skip comment line
        action = "comment"
        options = words
      } else if (words[0].startsWith("@") && words.length > 1) {
        target = words[0].slice(1, words[0].length)
        action = words[1]
        options = words.slice(2, words.length)
      } else {
        action = words[0]
        options = _.tail(words)
      }

      return { target, action, options, lineNumber }
    })
    .filter(notEmpty)
}
