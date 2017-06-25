import { Point } from "paper"
import { pointFromEvent, pointSub, pointAdd, pointMul, pointDiv, pointDot, rectFromPoints } from "../helpers/point"
import bindMouseHandler from "../helpers/bindMouseHandler"
import TextShape from "../Shape/TextShape"

const CENTER = new Point(0.5, 0.5)

function invertAnchor(a) {
  return pointAdd(pointMul(pointSub(a, CENTER), -1), CENTER)
}

function anchorToDirection(a) {
  return pointDiv(pointSub(a, CENTER), CENTER)
}

export default class DefaultMouseHandler {
  constructor(addScript, previewScript, getShapesInsideRect, setSelectionRect, changeMode, startTextEditing) {
    this.addScript = addScript
    this.previewScript = previewScript
    this.getShapesInsideRect = getShapesInsideRect
    this.setSelectionRect = setSelectionRect
    this.changeMode = changeMode
    this.startTextEditing = startTextEditing
  }

  onMouseDownStage(e) {
    e.stopPropagation()
    const bounds = e.target.getBoundingClientRect()
    function getLocalPosition(e) {
      return new Point(
        e.clientX - bounds.left,
        e.clientY - bounds.top
      )
    }

    const startPos = getLocalPosition(e)
    let selectedShapes = []

    function getSelectCommand() {
      return `select ${selectedShapes.join(" ")}`
    }

    this.setSelectionRect({
      origin: startPos,
      size: new Point(0, 0)
    })

    const onMouseMove = e => {
      const endPos = getLocalPosition(e)

      if (endPos.x === startPos.x &&
          endPos.y === startPos.y) {
        return
      }

      const rect = rectFromPoints(startPos, endPos)
      this.setSelectionRect(rect)
      selectedShapes = this.getShapesInsideRect(rect)

      if (selectedShapes.length > 0) {
        this.previewScript(getSelectCommand())
      } else {
        this.previewScript("")
      }
    }

    const onMouseUp = e => {
      this.previewScript("")
      this.setSelectionRect(null)

      if (selectedShapes.length === 0) {
        // 何も選択してなかったら選択解除
        this.addScript("deselectAll")
      } else {
        this.addScript(getSelectCommand())
      }
    }

    bindMouseHandler(onMouseMove, onMouseUp)
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
        tempScript = `select ${nameOrId}\ntranslate ${delta.x}px ${delta.y}px`
        this.previewScript(tempScript)
      }
    }

    const onMouseUp = e => {
      if (!moved) {
        // 移動せずクリックが終了した場合は選択状態にする
        const nameOrId = shape.name || shape.id
        // shift を押していたら複数選択
        const deselect = e.shiftKey ? "" : `deselectAll\n`
        this.addScript(`${deselect}select ${nameOrId}`)
      } else {
        // 移動してクリックが終了した場合は target の移動・リサイズを確定する
        this.addScript(tempScript)
        this.previewScript("")
      }
    }

    bindMouseHandler(onMouseMove, onMouseUp)
  }

  onDoubleClick(e, shape) {
    e.stopPropagation()

    if (shape instanceof TextShape) {
      this.changeMode("text")
      this.startTextEditing(shape.id, shape.text)
    }
  }
}
