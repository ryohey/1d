import _ from "lodash"
import shlex from "../helpers/Shlex"

function cleanup(text) {
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
export default function parseCommands(text) {
  const list = []
  text.split("\n").forEach((line, lineNumber) => {
    if (line.length === 0) {
      return
    }

    const words = shlex(cleanup(line))
    let target = null
    let action
    let options

    if (words[0].startsWith("@") && words.length > 1) {
      target = words[0].slice(1, words[0].length)
      action = words[1]
      options = words.slice(2, words.length)
    } else {
      action = words[0]
      options = _.tail(words)
    }

    list.push({ target, action, options, lineNumber })
  })
  return list
}
