import bindMouseHandler from "../helpers/bindMouseHandler"

export default class TextMouseHandler {
  constructor(addScript, previewScript, changeMouseMode) {
    this.addScript = addScript
    this.previewScript = previewScript
    this.changeMouseMode = changeMouseMode
    this.state = null
    this.startPos = null

    window.addEventListener("textshapechange", e => {
      if (this.state) {
        this.state.text = e.detail.target.value
        this.updatePreview()
      }
    })
  }

  updatePreview() {
    this.previewScript([...this.buildScript(), `edit`].join("\n"))
  }

  buildScript() {
    const { startPos, text } = this.state
    return [
      `moveTo ${startPos.x}px ${startPos.y}px`,
      `text "${text}"`,
      `fontSize 1`
    ]
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
    } else {
      this.addScript(this.buildScript().join("\n"))
      this.changeMouseMode("default")
      this.state = null
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
