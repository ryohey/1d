import React from "react"

export default function FontSelect({ fonts, value, onChange }) {
  return <select className="FontSelect" value={value} onChange={onChange}>
    {fonts.map(f =>
      <option style={{fontFamily: f}}>{f}</option>
    )}
  </select>
}
