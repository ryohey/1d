import { pointFromEvent, pointSub, pointAdd, pointMul, pointDiv, pointDot } from "./helpers/point"

const center = { x: 0.5, y: 0.5 }

function invertAnchor(a) {
  return pointAdd(pointMul(pointSub(a, center), -1), center)
}

function anchorToDirection(a) {
  return pointDiv(pointSub(a, center), center)
}

export default class MouseHandler {
  constructor(addScript, previewScript) {
    this.addScript = addScript
    this._previewScript = previewScript

    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)

    this.dragEvent = null
  }

  previewScript(t) {
    this.tempScript = t
    this._previewScript(t)
  }

  onMouseOver(e, shape) {
    console.log("onMouseOver", e, shape)
  }

  onMouseUp(e) {
    window.removeEventListener("mousemove", this.onMouseMove)
    window.removeEventListener("mouseup", this.onMouseUp)

    const { dragEvent } = this
    if (!dragEvent) {
      return
    }
    if (!dragEvent.moved) {
      // 移動せずクリックが終了した場合は選択状態にする
      const nameOrId = dragEvent.target.name || dragEvent.target.id
      // shift を押していたら複数選択
      const com = e.shiftKey ? "select" : "select1"
      this.addScript(`${com} ${nameOrId}`)
    } else {
      // 移動してクリックが終了した場合は target の移動・リサイズを確定する
      this.addScript(this.tempScript)
      this.previewScript("")
    }
    this.dragEvent = null
  }

  onMouseDownStage(e) {
    console.log("stage", e)
    this.addScript("deselectAll")
  }

  onMouseDown(e, shape, anchor) {
    e.stopPropagation()
    this.dragEvent = {
      startPos: pointFromEvent(e),
      startSize: shape.size,
      target: shape,
      moved: false,
      anchor
    }
    console.log("onMouseDown", e, shape)
    window.addEventListener("mousemove", this.onMouseMove)
    window.addEventListener("mouseup", this.onMouseUp)
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
      this.previewScript(`@${nameOrId} resize ${size.x}px ${size.y}px ${anchor.x} ${anchor.y}`)
    } else {
      // 移動
      const delta = pointSub(pointFromEvent(e), dragEvent.startPos)
      this.previewScript(`@${nameOrId} translate ${delta.x}px ${delta.y}px`)
    }
  }
}
