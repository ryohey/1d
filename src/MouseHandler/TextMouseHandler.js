import bindMouseHandler from "../helpers/bindMouseHandler"

export default class TextMouseHandler {
  constructor(addScript, previewScript, changeMouseMode) {
    this.addScript = addScript
    this.previewScript = previewScript
    this.changeMouseMode = changeMouseMode
    this.state = null
    this.startPos = null
    this.onTextShapeChange = this.onTextShapeChange.bind(this)
  }

  onTextShapeChange(e) {
    if (this.state) {
      this.state.text = e.detail.target.value
      this.updatePreview()
    }
  }

  updatePreview() {
    this.previewScript(this.buildScript(true).join("\n"))
  }

  buildScript(editing = false) {
    const { startPos, text, shapeId } = this.state
    if (shapeId) {
      const base = `@${shapeId} changeText "${text}"`
      return editing ? [`edit`, base] : [base]
    }
    const base = [
      `moveTo ${startPos.x}px ${startPos.y}px`,
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
      this.state = {
        text: "Hello World",
        startPos
      }
      this.updatePreview()
      window.addEventListener("textshapechange", this.onTextShapeChange)
    } else {
      this.addScript(this.buildScript().join("\n"))
      this.previewScript("")
      this.changeMouseMode("default")
      this.state = null
      window.removeEventListener("textshapechange", this.onTextShapeChange)
      return
    }

    const onMouseMove = e => {
      const endPos = getLocalPosition(e)
    }

    const onMouseUp = e => {
      const endPos = getLocalPosition(e)
    }

    bindMouseHandler(onMouseMove, onMouseUp)
  }

  onMouseDown() {
  }
}
