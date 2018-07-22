export function InvalidStateError(message: string) {
  return new Error(`Invalid state error: ${message}`)
}

export function InvalidCommandError(message: string) {
  return new Error(`Invalid command error: ${message}`)
}
