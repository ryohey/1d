export default function bindMouseHandler(onMouseMove, onMouseUp) {
  function _onMouseUp(e) {
    onMouseUp(e)

    window.removeEventListener("mousemove", onMouseMove)
    window.removeEventListener("mouseup", _onMouseUp)
  }

  window.addEventListener("mousemove", onMouseMove)
  window.addEventListener("mouseup", _onMouseUp)
}
