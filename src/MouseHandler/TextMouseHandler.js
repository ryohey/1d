import bindMouseHandler from "../helpers/bindMouseHandler"

export default class TextMouseHandler {
  constructor(addScript, previewScript, changeMouseMode) {
    this.addScript = addScript
    this.previewScript = previewScript
    this.changeMouseMode = changeMouseMode
    this.state = null
    this.startPos = null
  }

  updatePreview() {
    this.previewScript(this.buildScript(true).join("\n"))
  }

  beginEditing(shapeId, text, position) {
    this.state = {
      text,
      shapeId,
      position
    }
    this.updatePreview()
  }

  endEditing() {
    this.addScript(this.buildScript().join("\n"))
    this.previewScript("")
    this.changeMouseMode("default")
    this.state = null
  }

  buildScript(editing = false) {
    const { position, text, shapeId } = this.state
    if (shapeId) {
      const base = `@${shapeId} changeText "${text}"`
      return editing ? [`edit`, base] : [base]
    }
    const base = [
      `moveTo ${position.x}px ${position.y}px`,
      `text "${text}"`,
      `fontSize 1`
    ]
    return editing ? [...base, `edit`] : base
  }

  onMouseDownStage(e) {
    const bounds = e.currentTarget.getBoundingClientRect()
    function getLocalPosition(e) {
      return {
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top
      }
    }
    const startPos = getLocalPosition(e)

    if (!this.state) {
      this.beginEditing(undefined, "Hello World", startPos)
    } else {
      this.endEditing()
    }
  }

  onMouseDown() {
  }

  onChangeTextInput(e, shape) {
    e.stopPropagation()

    if (!this.state) {
      return
    }
    this.state.text = e.target.value
    this.updatePreview()
  }

  onKeyDownTextInput(e, shape) {
    e.stopPropagation()
  }
}
