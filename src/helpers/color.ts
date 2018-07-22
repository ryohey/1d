import { ColorResult } from "react-color"

export function rgbaString(color: ColorResult) {
  const { r, b, g, a } = color.rgb
  return `rgba(${r},${g},${b},${a})`
}
