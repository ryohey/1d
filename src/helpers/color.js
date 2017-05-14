export function rgbaString(color) {
  const { r, b, g, a } = color.rgb
  return `rgba(${r},${g},${b},${a})`
}
