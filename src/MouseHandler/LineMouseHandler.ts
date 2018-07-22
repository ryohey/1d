import ShapeMouseHandlerBase from "./ShapeMouseHandlerBase"

export default ShapeMouseHandlerBase((startPos, endPos) => {
  const moveTo = `moveTo ${startPos.x}px ${startPos.y}px`
  const lineTo = `lineTo ${endPos.x}px ${endPos.y}px`
  const stroke = `stroke gray`
  return [moveTo, lineTo, stroke, "close"]
})
