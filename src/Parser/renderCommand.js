import _ from "lodash"

import { InvalidCommandError } from "../Error.js"
import allCommands from "../Command/Commands.js"
import State from "./RenderState"

export default function renderCommand(commands, mouseHandler) {
  const state = new State()
  state.lastId = 0
  state.pos = { x: 0, y: 0 }
  state.transform = {
    scale: 1
  }
  state.shapes = []
  state.mouseHandler = mouseHandler

  for (let com of commands) {
    const opts = com.options
    let error

    // コマンドに対応する plugin を探してコマンドを実行する
    const plugin = _.find(allCommands, p => p.action === com.action)
    if (plugin) {
      error = plugin.validateOptions(opts)
      if (!error) {
        error = plugin.perform(state, com)
      }
    } else {
      error = InvalidCommandError(`unknown action: ${com.action}`)
    }

    if (error) {
      console.warn(`error: ${error.message} for action "${com.action}" at line ${com.lineNumber}`)
    }
  }

  return state.shapes
}
