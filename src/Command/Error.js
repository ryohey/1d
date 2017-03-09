export function InvalidStateError(message) {
  return new Error(`invalid state error: ${message}`)
}

export function InvalidCommandError(message) {
  return new Error(`invalid command error: ${message}`)
}
