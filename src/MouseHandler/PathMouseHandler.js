import _ from "lodash"
import bindMouseHandler from "../helpers/bindMouseHandler"
import { pointDistance, pointMul, pointSub } from "../helpers/point"

function commandFromPoint(p) {
  if (p.c1 && p.c2) {
    return `curveTo ${p.x}px ${p.y}px ${p.c1.x}px ${p.c1.y}px ${p.c2.x}px ${p.c2.y}px`
  }
  return `lineTo ${p.x}px ${p.y}px`
}

function pointsToScript(points, fillColor="rgba(0,0,0,0.1)", strokeColor = "gray", lineWidth = 2) {
  if (points.length === 0) {
    return []
  }
  const head = _.head(points)
  const tail = _.tail(points)
  return [
    `moveTo ${head.x}px ${head.y}px`,
    ...tail.map(commandFromPoint),
    `strokeWidth 2px`,
    `fill rgba(0,0,0,0.1)`,
    `stroke gray`,
  ]
}

export default class PathMouseHandler {
  constructor(addScript, previewScript, changeMode) {
    this.addScript = addScript
    this.previewScript = previewScript
    this.changeMode = changeMode
    this.points = []
  }

  updatePreview() {
    this.previewScript(pointsToScript(this.points).join("\n"))
  }

  endEditing() {
    this.previewScript("")
    this.addScript([
      ...pointsToScript(this.points),
      `close`
    ].join("\n"))
    this.points = []
    this.changeMode("default")
  }

  onMouseDownStage(e) {
    const bounds = e.currentTarget.getBoundingClientRect()
    function getLocalPosition(e) {
      return {
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top
      }
    }

    const startPos = getLocalPosition(e)

    // 最初の点をクリックしたらパスを閉じて終了
    if (this.points.length > 0 && pointDistance(startPos, this.points[0]) < 5) {
      this.endEditing()
    }

    this.points.push(startPos)
    this.updatePreview()

    const onMouseMove = e => {
      const p = _.last(this.points)
      const c2 = pointSub(getLocalPosition(e), p)
      const c1 = pointMul(c2, -1)
      p.c1 = c1
      p.c2 = c2
      this.updatePreview()
    }

    const onMouseUp = e => {
    }

    bindMouseHandler(onMouseMove, onMouseUp)
  }

  onMouseDown() {
  }
}
