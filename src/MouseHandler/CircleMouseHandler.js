import { pointSub, pointMul, pointAdd } from "../helpers/point"
import ShapeMouseHandlerBase from "./ShapeMouseHandlerBase"

export default ShapeMouseHandlerBase((startPos, endPos) => {
  const radius = pointMul(pointSub(endPos, startPos), 0.5)
  const center = pointAdd(startPos, radius)
  const moveTo = `moveTo ${center.x}px ${center.y}px`
  const rect = `circle ${radius.x}px ${radius.y}px`
  const fill = `fill white`
  const stroke = `stroke gray`
  return [moveTo, rect, fill, stroke]
})
