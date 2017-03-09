import { pointFromEvent, pointSub, pointAdd, pointMul, pointDiv, pointDot } from "./helpers/point"

const center = { x: 0.5, y: 0.5 }

function invertAnchor(a) {
  return pointAdd(pointMul(pointSub(a, center), -1), center)
}

function anchorToDirection(a) {
  return pointDiv(pointSub(a, center), center)
}

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
      this.app.addScript(`select1 ${nameOrId}`)
    } else {
      // 移動してクリックが終了した場合は target の移動・リサイズを確定する
      this.app.addScript(this.app.state.tempScript)
      this.app.previewScript("")
    }
    this.dragEvent = null
  }

  onMouseDown(e, shape, anchor) {
    this.dragEvent = {
      startPos: pointFromEvent(e),
      startSize: shape.size,
      target: shape,
      moved: false,
      anchor
    }
    console.log("onMouseDown", e, shape)
  }

  onMouseMove(e) {
    const { dragEvent } = this
    if (!dragEvent) {
      return
    }
    dragEvent.moved = true
    const nameOrId = dragEvent.target.name || dragEvent.target.id

    if (dragEvent.anchor) {
      // リサイズ
      const moved = pointSub(pointFromEvent(e), dragEvent.startPos)
      const anchor = invertAnchor(dragEvent.anchor)
      const delta = pointDot(moved, anchorToDirection(dragEvent.anchor))
      const size = pointAdd(delta, dragEvent.startSize)
      console.log(dragEvent.anchor, anchor)
      this.app.previewScript(`@${nameOrId} resize ${size.x}px ${size.y}px ${anchor.x} ${anchor.y}`)
    } else {
      // 移動
      const delta = pointSub(pointFromEvent(e), dragEvent.startPos)
      this.app.previewScript(`@${nameOrId} translate ${delta.x}px ${delta.y}px`)
    }
  }
}
