import { Point } from "paper"
import bindMouseHandler from "../helpers/bindMouseHandler"
import {
  IMouseHandler,
  AddScriptFunc,
  PreviewScriptFunc,
  ChangeModeFunc
} from "./IMouseHandler"

type ShapeCreationFunc = (start: Point, end: Point) => string[]

// シェイプを作成する MouseHandler のベースクラス
export default (createScript: ShapeCreationFunc) =>
  class ShapeMouseHandlerBase implements IMouseHandler {
    private addScript: AddScriptFunc
    private previewScript: PreviewScriptFunc
    private changeMouseMode: ChangeModeFunc

    constructor(
      addScript: AddScriptFunc,
      previewScript: PreviewScriptFunc,
      changeMouseMode: ChangeModeFunc
    ) {
      this.addScript = addScript
      this.previewScript = previewScript
      this.changeMouseMode = changeMouseMode
    }

    onMouseDownStage(e) {
      const bounds = e.currentTarget.getBoundingClientRect()
      function getLocalPosition(e) {
        return new Point(e.clientX - bounds.left, e.clientY - bounds.top)
      }

      const startPos = getLocalPosition(e)

      const onMouseMove = e => {
        const endPos = getLocalPosition(e)
        const script = createScript(startPos, endPos)
        this.previewScript([...script, `deselectAll`].join("\n"))
      }

      const onMouseUp = e => {
        const endPos = getLocalPosition(e)
        const script = createScript(startPos, endPos)
        this.previewScript("")
        this.addScript(script.join("\n"))
        this.changeMouseMode("default")
      }

      bindMouseHandler(onMouseMove, onMouseUp)
    }

    onMouseDown() {}
    onDoubleClick() {}
    onKeyDownTextInput() {}
    onChangeTextInput() {}
  }
