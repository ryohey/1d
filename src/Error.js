export function InvalidStateError(message) {
  return new Error(`Invalid state error: ${message}`)
}

export function InvalidCommandError(message) {
  return new Error(`Invalid command error: ${message}`)
}
