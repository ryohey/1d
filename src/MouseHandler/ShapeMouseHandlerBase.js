import bindMouseHandler from "../helpers/bindMouseHandler"

export default (createScript) => class ShapeMouseHandlerBase {
  constructor(addScript, previewScript, changeMouseMode) {
    this.addScript = addScript
    this.previewScript = previewScript
    this.changeMouseMode = changeMouseMode
  }

  onMouseDownStage(e) {
    const bounds = e.target.getBoundingClientRect()
    function getLocalPosition(e) {
      return {
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top
      }
    }

    const startPos = getLocalPosition(e)

    const onMouseMove = e => {
      const endPos = getLocalPosition(e)
      const script = createScript(startPos, endPos)
      this.previewScript([...script, `deselectAll`].join("\n"))
    }

    const onMouseUp = e => {
      const endPos = getLocalPosition(e)
      const script = createScript(startPos, endPos)
      this.previewScript("")
      this.addScript(script.join("\n"))
      this.changeMouseMode("default")
    }

    bindMouseHandler(onMouseMove, onMouseUp)
  }

  onMouseDown() {
  }
}
