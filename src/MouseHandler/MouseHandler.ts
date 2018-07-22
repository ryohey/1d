import DefaultMouseHandler from "./DefaultMouseHandler"
import RectMouseHandler from "./RectMouseHandler"
import CircleMouseHandler from "./CircleMouseHandler"
import LineMouseHandler from "./LineMouseHandler"
import PathMouseHandler from "./PathMouseHandler"
import TextMouseHandler from "./TextMouseHandler"
import { IMouseHandler } from "./IMouseHandler"

export type MouseHandlerMode =
  | "default"
  | "rect"
  | "circle"
  | "line"
  | "path"
  | "text"

export default class MouseHandler implements IMouseHandler {
  private childHandlers: { [index: string]: IMouseHandler }
  mode: MouseHandlerMode

  constructor(
    addScript,
    previewScript,
    getShapesInsideRect,
    setSelectionRect,
    changeMode
  ) {
    this.mode = "default"

    const startTextEditing = (shapeId, text) => {
      const textHandler = this.childHandlers["text"] as TextMouseHandler
      textHandler.beginEditing(shapeId, text)
    }

    this.childHandlers = {
      default: new DefaultMouseHandler(
        addScript,
        previewScript,
        getShapesInsideRect,
        setSelectionRect,
        changeMode,
        startTextEditing
      ),
      rect: new RectMouseHandler(addScript, previewScript, changeMode),
      circle: new CircleMouseHandler(addScript, previewScript, changeMode),
      line: new LineMouseHandler(addScript, previewScript, changeMode),
      path: new PathMouseHandler(addScript, previewScript, changeMode),
      text: new TextMouseHandler(addScript, previewScript, changeMode)
    }
  }

  set options(options) {
    Object.assign(this.childHandlers[this.mode], options)
  }

  onMouseDownStage(e) {
    this.childHandlers[this.mode].onMouseDownStage(e)
  }

  onMouseDown(e, shape, anchor) {
    this.childHandlers[this.mode].onMouseDown(e, shape, anchor)
  }

  onDoubleClick(e, shape) {
    this.childHandlers[this.mode].onDoubleClick(e, shape)
  }

  onKeyDownTextInput(e, shape) {
    this.childHandlers[this.mode].onKeyDownTextInput(e, shape)
  }

  onChangeTextInput(e, shape) {
    this.childHandlers[this.mode].onChangeTextInput(e, shape)
  }
}
