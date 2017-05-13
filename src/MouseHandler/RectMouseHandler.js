import { pointSub } from "../helpers/point"
import ShapeMouseHandlerBase from "./ShapeMouseHandlerBase"

export default ShapeMouseHandlerBase((startPos, endPos) => {
  const moveTo = `moveTo ${startPos.x}px ${startPos.y}px`
  const delta = pointSub(endPos, startPos)
  const rect = `rect ${delta.x}px ${delta.y}px`
  const fill = `fill white`
  const stroke = `stroke gray`
  return [moveTo, rect, fill, stroke]
})
