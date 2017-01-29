import { pointFromEvent, pointSub } from "./helpers/point"

export default class MouseHandler {
  constructor(app) {
    this.app = app
    this.startPos = { x: 0, y: 0 }
    this.target = null
  }

  previewScript(line) {
    this.app.setState({
      tempScript: line
    })
  }

  addScript(line) {
    this.app.setState({
      scriptText: this.app.state.scriptText + "\n" + line
    })
  }

  onMouseOver(e, shape) {
    console.log("onMouseOver", e, shape)
  }

  onMouseUp(e) {
    console.log("onMouseUp", e)
    this.target = null
    this.addScript(this.app.state.tempScript)
    this.previewScript("")
  }

  onMouseDown(e, shape) {
    this.startPos = pointFromEvent(e)
    this.target = shape
    console.log("onMouseDown", e, shape)
  }

  onMouseMove(e) {
    if (!this.target) {
      return
    }
    const delta = pointSub(pointFromEvent(e), this.startPos)
    console.log("onMouseMove", delta)
    const nameOrId = this.target.name || this.target.id
    this.previewScript(`@${nameOrId} translate ${delta.x}px ${delta.y}px`)
  }
}
