import { Point } from "paper"
import {
  IMouseHandler,
  AddScriptFunc,
  PreviewScriptFunc,
  ChangeModeFunc
} from "./IMouseHandler"

export default class TextMouseHandler implements IMouseHandler {
  private addScript: AddScriptFunc
  private previewScript: PreviewScriptFunc
  private changeMouseMode: ChangeModeFunc
  private state: any

  constructor(addScript, previewScript, changeMouseMode) {
    this.addScript = addScript
    this.previewScript = previewScript
    this.changeMouseMode = changeMouseMode
    this.state = null
  }

  updatePreview() {
    this.previewScript(this.buildScript(true).join("\n"))
  }

  beginEditing(shapeId, text, position?) {
    this.state = {
      text,
      shapeId,
      position,
      initialText: text
    }
    this.updatePreview()
  }

  endEditing() {
    const { shapeId, text, initialText } = this.state

    // 既存のテキストシェイプの編集でテキストが変化したときだけスクリプトを追加する
    if (shapeId === undefined || text !== initialText) {
      this.addScript(this.buildScript().join("\n"))
    }

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
      return new Point(e.clientX - bounds.left, e.clientY - bounds.top)
    }
    const startPos = getLocalPosition(e)

    if (!this.state) {
      this.beginEditing(undefined, "Hello World", startPos)
    } else {
      this.endEditing()
    }
  }

  onMouseDown() {}
  onDoubleClick() {}

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

    if (e.key === "Enter" && e.ctrlKey) {
      this.endEditing()
    }
  }
}
