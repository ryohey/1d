import { pointSub } from "../helpers/point"
import bindMouseHandler from "../helpers/bindMouseHandler"

export default class RectMouseHandler {
  constructor(addScript, previewScript, changeMouseMode) {
    this.addScript = addScript
    this.previewScript = previewScript
    this.changeMouseMode = changeMouseMode
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
    const moveTo = `moveTo ${startPos.x}px ${startPos.y}px`

    const rectScript = (endPos) => {
      const delta = pointSub(endPos, startPos)
      const rect = `rect ${delta.x}px ${delta.y}px`
      const fill = `fill white`
      const stroke = `stroke gray`
      return [moveTo, rect, fill, stroke]
    }

    const onMouseMove = e => {
      const endPos = getLocalPosition(e)
      const script = rectScript(endPos)
      this.previewScript([...script, `deselectAll`].join("\n"))
    }

    const onMouseUp = e => {
      const endPos = getLocalPosition(e)
      const script = rectScript(endPos)
      this.previewScript("")
      this.addScript(script.join("\n"))
      this.changeMouseMode("default")
    }

    bindMouseHandler(onMouseMove, onMouseUp)
  }

  onMouseDown(e, shape, anchor) {
  }
}
