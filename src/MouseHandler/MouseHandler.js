import DefaultMouseHandler from "./DefaultMouseHandler"
import RectMouseHandler from "./RectMouseHandler"
import CircleMouseHandler from "./CircleMouseHandler"
import LineMouseHandler from "./LineMouseHandler"

export default class MouseHandler {
  constructor(addScript, previewScript, getShapesInsideRect, setSelectionRect, changeMode) {
    this.mode = "default"

    this.childHandlers = {
      "default": new DefaultMouseHandler(addScript, previewScript, getShapesInsideRect, setSelectionRect),
      "rect": new RectMouseHandler(addScript, previewScript, changeMode),
      "circle": new CircleMouseHandler(addScript, previewScript, changeMode),
      "line": new LineMouseHandler(addScript, previewScript, changeMode),
    }
  }

  onMouseDownStage(e) {
    this.childHandlers[this.mode].onMouseDownStage(e)
  }

  onMouseDown(e, shape, anchor) {
    this.childHandlers[this.mode].onMouseDown(e, shape, anchor)
  }
}
