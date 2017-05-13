import DefaultMouseHandler from "./DefaultMouseHandler"
import RectMouseHandler from "./RectMouseHandler"

export default class MouseHandler {
  constructor(addScript, previewScript, getShapesInsideRect, setSelectionRect) {
    this.mode = "default"

    this.childHandlers = {
      "default": new DefaultMouseHandler(addScript, previewScript, getShapesInsideRect, setSelectionRect),
      "rect": new RectMouseHandler(addScript, previewScript)
    }
  }

  onMouseDownStage(e) {
    this.childHandlers[this.mode].onMouseDownStage(e)
  }

  onMouseDown(e, shape, anchor) {
    this.childHandlers[this.mode].onMouseDown(e, shape, anchor)
  }
}
