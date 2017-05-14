import _ from "lodash"
import bindMouseHandler from "../helpers/bindMouseHandler"
import { pointDistance } from "../helpers/point"

function pointsToScript(points, fillColor="rgba(0,0,0,0.1)", strokeColor = "gray", lineWidth = 2) {
  const head = _.head(points)
  const tail = _.tail(points)
  return [
    `moveTo ${head.x}px ${head.y}px`,
    ...tail.map(p => `lineTo ${p.x}px ${p.y}px`),
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

  onMouseDownStage(e) {
    const bounds = e.currentTarget.getBoundingClientRect()
    function getLocalPosition(e) {
      return {
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top
      }
    }

    const startPos = getLocalPosition(e)

    if (this.points.length > 0 && pointDistance(startPos, this.points[0]) < 5) {
      this.addScript([
        ...pointsToScript(this.points),
        `close`
      ].join("\n"))
      this.points = []
      this.changeMode("default")
    }

    this.points.push(startPos)

    this.previewScript(pointsToScript(this.points).join("\n"))

    const onMouseMove = e => {
      const endPos = getLocalPosition(e)

      // TODO: change curve
    }

    const onMouseUp = e => {
      const endPos = getLocalPosition(e)
      // const script = createScript(startPos, endPos)
      // this.addScript(script.join("\n"))
    }

    bindMouseHandler(onMouseMove, onMouseUp)
  }

  onMouseDown() {
  }
}
