import DefaultMouseHandler from "./DefaultMouseHandler"

export default class MouseHandler {
  constructor(addScript, previewScript, getShapesInsideRect, setSelectionRect) {
    this.mode = "default"

    this.childHandlers = {
      "default": new DefaultMouseHandler(addScript, previewScript, getShapesInsideRect, setSelectionRect)
    }
  }

  onMouseDownStage(e) {
    e.stopPropagation()
    this.childHandlers[this.mode].onMouseDownStage(e)
  }

  onMouseDown(e, shape, anchor) {
    e.stopPropagation()
    this.childHandlers[this.mode].onMouseDown(e, shape, anchor)
  }
}
