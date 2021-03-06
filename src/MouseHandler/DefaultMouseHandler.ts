import { MouseEvent } from "react"
import { Point, Rectangle, Size } from "paper"
import { pointFromEvent } from "../helpers/point"
import bindMouseHandler from "../helpers/bindMouseHandler"
import TextShape from "../Shape/TextShape"
import {
  IMouseHandler,
  AddScriptFunc,
  PreviewScriptFunc,
  ChangeModeFunc
} from "./IMouseHandler"
import Shape from "../Shape/Shape"

const CENTER = new Point(0.5, 0.5)

function invertAnchor(a) {
  return a
    .subtract(CENTER)
    .multiply(-1)
    .add(CENTER)
}

function anchorToDirection(a) {
  return a.subtract(CENTER).divide(CENTER)
}

export default class DefaultMouseHandler implements IMouseHandler {
  private addScript: AddScriptFunc
  private previewScript: PreviewScriptFunc
  private changeMode: ChangeModeFunc
  private getShapesInsideRect
  private setSelectionRect
  private startTextEditing

  constructor(
    addScript: AddScriptFunc,
    previewScript: PreviewScriptFunc,
    getShapesInsideRect,
    setSelectionRect,
    changeMode: ChangeModeFunc,
    startTextEditing
  ) {
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
      return new Point(e.clientX - bounds.left, e.clientY - bounds.top)
    }

    const startPos = getLocalPosition(e)
    let selectedShapes: Shape[] = []

    function getSelectCommand() {
      return `select ${selectedShapes.join(" ")}`
    }

    this.setSelectionRect(new Rectangle(startPos, new Size(0, 0)))

    const onMouseMove = e => {
      const endPos = getLocalPosition(e)

      if (endPos.x === startPos.x && endPos.y === startPos.y) {
        return
      }

      const rect = new Rectangle(startPos, endPos)
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

  onMouseDown(downEvent: MouseEvent<any>, shape: Shape, anchor: Point) {
    downEvent.stopPropagation()
    const startPos = pointFromEvent(downEvent)
    let moved = false
    let tempScript: string

    const onMouseMove = e => {
      if (e.clientX === startPos.x && e.clientY === startPos.y) {
        return
      }
      moved = true
      const nameOrId = shape.name || shape.id

      if (anchor) {
        // リサイズ
        const moving = pointFromEvent(e).subtract(startPos)
        const anchor2 = invertAnchor(anchor)
        const delta = moving.multiply(anchorToDirection(anchor))
        const size = delta.add(new Point(shape.bounds.size))
        tempScript = `@${nameOrId} resize ${size.x}px ${size.y}px ${
          anchor2.x
        } ${anchor2.y}`
        this.previewScript(tempScript)
      } else {
        // 移動
        const delta = pointFromEvent(e).subtract(startPos)
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

  onDoubleClick(e: MouseEvent<any>, shape: Shape) {
    e.stopPropagation()

    if (shape instanceof TextShape) {
      this.changeMode("text")
      this.startTextEditing(shape.id, shape.text)
    }
  }

  onKeyDownTextInput() {}
  onChangeTextInput() {}
}
