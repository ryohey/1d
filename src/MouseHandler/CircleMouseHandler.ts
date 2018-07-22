import ShapeMouseHandlerBase from "./ShapeMouseHandlerBase"

export default ShapeMouseHandlerBase((startPos, endPos) => {
  const radius = endPos.subtract(startPos).multiply(0.5)
  const center = startPos.add(radius)
  const moveTo = `moveTo ${center.x}px ${center.y}px`
  const rect = `circle ${radius.x}px ${radius.y}px`
  const fill = `fill white`
  const stroke = `stroke gray`
  return [moveTo, rect, fill, stroke]
})
