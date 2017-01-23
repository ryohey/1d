import React, { Component } from 'react';
import _ from "lodash"
import renderCommand from "./helpers/renderCommand"

import './App.css';

const defaultScript = `
grid 16
stroke rgba(0,0,0,0.03)

move 1 1
line 4 3
line -2 1
close
fill blue
name tri

moveTo 10 4
rect 3 5
fill yellow

moveTo 5 15
circle 2
fill orange

move 3 0
copy
fill lightgreen

move 3 0
copy
stroke lightgray

move 3 0
copy
fill lightblue

select tri
copy
stroke red
`

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scriptText: defaultScript,
    }
  }
  render() {
    const onChangeText = e => {
      const scriptText = e.target.value
      this.setState({ scriptText })
    }
    const { scriptText } = this.state
    const svgContent = renderCommand(scriptText)
    return (
      <div className="App">
        <div>
          <textarea value={scriptText} onChange={onChangeText} />
        </div>
        <div>
          <svg id="svg">{svgContent}</svg>
        </div>
      </div>
    )
  }
}

export default App;
