import _ from "lodash"

import { InvalidCommandError } from "../Error"
import allCommands from "../Command/Commands"
import State from "./RenderState"

export default function renderCommand(commands, mouseHandler) {
  const state = new State(mouseHandler)

  for (let com of commands) {
    const opts = com.options
    let error

    // コマンドに対応する plugin を探してコマンドを実行する
    const plugin = _.find(allCommands, p => p.action === com.action)
    if (plugin) {
      error = plugin.validateOptions && plugin.validateOptions(opts)
      if (!error) {
        error = plugin.perform(state, com)
      }
    } else {
      error = InvalidCommandError(`unknown action: ${com.action}`)
    }

    if (error) {
      console.warn(
        `error: ${error.message} for action "${com.action}" at line ${
          com.lineNumber
        }`
      )
    }
  }

  return state.shapes.sort((a, b) => a.zIndex - b.zIndex)
}
