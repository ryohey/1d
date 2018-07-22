import React, { SFC } from "react"
import "mdi/css/materialdesignicons.css"

function flatJoin(...classes) {
  return classes.filter(c => c).join(" ")
}

export interface IconProps {
  component?
  name: string
  className?: string
  onClick?
}

const Icon: SFC<IconProps> = ({ component, name, className, onClick }) => {
  const ElementType = component || "div"
  return (
    <ElementType
      onClick={onClick}
      className={flatJoin("Icon", "mdi", `mdi-${name}`, className)}
    />
  )
}

export default Icon
