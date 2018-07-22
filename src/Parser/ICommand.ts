export interface ICommand {
  action: string
  target: string | null
  options: string[]
  lineNumber: number
}
