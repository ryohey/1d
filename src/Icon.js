import React from "react"
import "mdi/css/materialdesignicons.css"

function flatJoin(...classes) {
  return classes.filter(c => c).join(" ")
}

export default function Icon({
  component,
  name,
  className,
  onClick
}) {
  const ElementType = component || "div"
  return <ElementType
    onClick={onClick}
    className={flatJoin("Icon", "mdi", `mdi-${name}`, className)}
  />
}
