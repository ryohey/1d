import { pointFromEvent, pointSub, pointAdd, pointMul, pointDiv, pointDot, rectFromPoints } from "./helpers/point"

const CENTER = { x: 0.5, y: 0.5 }

function invertAnchor(a) {
  return pointAdd(pointMul(pointSub(a, CENTER), -1), CENTER)
}

function anchorToDirection(a) {
  return pointDiv(pointSub(a, CENTER), CENTER)
}

export default class MouseHandler {
  constructor(addScript, previewScript, getShapesInsideRect, setSelectionRect) {
    this.addScript = addScript
    this.previewScript = previewScript
    this.getShapesInsideRect = getShapesInsideRect
    this.setSelectionRect = setSelectionRect
  }

  onMouseOver(e, shape) {
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
    let moved = false
    let selectedShapes = []

    function getSelectCommand() {
      return `select ${selectedShapes.join(" ")}`
    }

    this.setSelectionRect({
      origin: startPos,
      size: { x: 0, y: 0 }
    })

    const onMouseMove = e => {
      const endPos = getLocalPosition(e)
      console.log(endPos, e.clientX, e.pageX, e.offsetX)

      if (endPos.x === startPos.x &&
          endPos.y === startPos.y) {
        return
      }
      moved = true

      const rect = rectFromPoints(startPos, endPos)
      this.setSelectionRect(rect)
      selectedShapes = this.getShapesInsideRect(rect)

      if (selectedShapes.length > 0) {
        this.previewScript(getSelectCommand())
      }
    }

    const onMouseUp = e => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)

      this.previewScript("")
      this.setSelectionRect(null)

      if (selectedShapes.length === 0) {
        // 何も選択してなかったら選択解除
        this.addScript("deselectAll")
      } else {
        this.addScript(getSelectCommand())
      }
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
  }

  onMouseDown(downEvent, shape, anchor) {
    downEvent.stopPropagation()

    const startPos = pointFromEvent(downEvent)
    let moved = false
    let tempScript

    const onMouseMove = e => {
      if (e.clientX === startPos.x &&
          e.clientY === startPos.y) {
        return
      }
      moved = true
      const nameOrId = shape.name || shape.id

      if (anchor) {
        // リサイズ
        const moving = pointSub(pointFromEvent(e), startPos)
        const anchor2 = invertAnchor(anchor)
        const delta = pointDot(moving, anchorToDirection(anchor))
        const size = pointAdd(delta, shape.size)
        tempScript = `@${nameOrId} resize ${size.x}px ${size.y}px ${anchor2.x} ${anchor2.y}`
        this.previewScript(tempScript)
      } else {
        // 移動
        const delta = pointSub(pointFromEvent(e), startPos)
        tempScript = `@${nameOrId} translate ${delta.x}px ${delta.y}px`
        this.previewScript(tempScript)
      }
    }

    const onMouseUp = e => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)

      if (!moved) {
        // 移動せずクリックが終了した場合は選択状態にする
        const nameOrId = shape.name || shape.id
        // shift を押していたら複数選択
        const com = e.shiftKey ? "select" : "select1"
        this.addScript(`${com} ${nameOrId}`)
      } else {
        // 移動してクリックが終了した場合は target の移動・リサイズを確定する
        this.addScript(tempScript)
        this.previewScript("")
      }
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
  }
}
