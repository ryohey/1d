import React from "react"
import "mdi/css/materialdesignicons.css"

function flatJoin(...classes) {
  return classes.filter(c => c).join(" ")
}

export default function Icon({
  component,
  name,
  className
}) {
  const ElementType = component || "div"
  return <ElementType
    className={flatJoin("Icon", "mdi", `mdi-${name}`, className)}
  />
}
