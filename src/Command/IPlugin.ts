import { ICommand } from "../Parser/ICommand"
import RenderState from "../Parser/RenderState"

export interface IPlugin {
  action: string
  validateOptions?: (opts: any) => Error | null
  perform: (state: RenderState, com: ICommand) => Error | null
}
