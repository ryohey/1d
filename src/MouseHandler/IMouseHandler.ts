import Shape from "../Shape/Shape"
import { Point } from "paper"
import { MouseEvent, ChangeEvent, KeyboardEvent } from "react"

export type AddScriptFunc = (script: string) => void
export type PreviewScriptFunc = (script: string) => void
export type ChangeModeFunc = (mode: string) => void

export interface IMouseHandler {
  onMouseDownStage: (e: MouseEvent<any>) => void
  onMouseDown: (e: MouseEvent<any>, shape: Shape, anchor?: Point) => void
  onDoubleClick: (e: MouseEvent<any>, shape: Shape) => void
  onKeyDownTextInput: (e: KeyboardEvent<HTMLInputElement>, shape: Shape) => void
  onChangeTextInput: (e: ChangeEvent<HTMLInputElement>, shape: Shape) => void
}
