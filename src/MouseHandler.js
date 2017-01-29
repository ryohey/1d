import { pointFromEvent, pointSub } from "./helpers/point"

export default class MouseHandler {
  constructor(app) {
    this.app = app
    this.dragEvent = null
  }

  onMouseOver(e, shape) {
    console.log("onMouseOver", e, shape)
  }

  onMouseUp(e) {
    const { dragEvent } = this
    if (!dragEvent) {
      return
    }
    if (!dragEvent.moved) {
      // 移動せずクリックが終了した場合は選択状態にする
      const nameOrId = dragEvent.target.name || dragEvent.target.id
      this.app.addScript(`select ${nameOrId}`)
    } else {
      // 移動してクリックが終了した場合は target の移動を確定する
      this.app.addScript(this.app.state.tempScript)
      this.app.previewScript("")
    }
    this.dragEvent = null
  }

  onMouseDown(e, shape) {
    this.dragEvent = {
      startPos: pointFromEvent(e),
      target: shape,
      moved: false
    }
    console.log("onMouseDown", e, shape)
  }

  onMouseMove(e) {
    const { dragEvent } = this
    if (!dragEvent) {
      return
    }
    dragEvent.moved = true
    const delta = pointSub(pointFromEvent(e), dragEvent.startPos)
    console.log("onMouseMove", delta)
    const nameOrId = dragEvent.target.name || dragEvent.target.id
    this.app.previewScript(`@${nameOrId} translate ${delta.x}px ${delta.y}px`)
  }
}
