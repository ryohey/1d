import React, { Component } from "react"
import reactCSS from "reactcss"
import { SketchPicker } from "react-color"

import "./ColorButton.css"

export default class ColorButton extends Component {
  constructor(props) {
    super(props)

    this.state = {
      displayColorPicker: false,
      color: props.color,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.color !== nextProps.color) {
      this.setState({ color: nextProps.color })
    }
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  }

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  }

  handleChange = (color) => {
    this.setState({ color })
    this.props.onChange(color)
  }

  handleChangeComplete = (color, event) => {
    this.setState({ color })
    this.props.onChangeComplete(color)
  }

  render() {

    const styles = reactCSS({
      "default": {
        color: {
          width: "36px",
          height: "14px",
          borderRadius: "2px",
          background: this.state.color,
        },
        swatch: {
          padding: "5px",
          background: "#fff",
          borderRadius: "1px",
          boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
          display: "inline-block",
          cursor: "pointer",
        },
        popover: {
          position: "absolute",
          zIndex: "2",
          right: "30px"
        },
        cover: {
          position: "fixed",
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px",
        },
      },
    })

    return (
      <div>
        <div style={ styles.swatch } onClick={ this.handleClick }>
          <div style={ styles.color } />
        </div>
        { this.state.displayColorPicker ? <div style={ styles.popover }>
          <div style={ styles.cover } onClick={ this.handleClose }/>
            <SketchPicker
              color={ this.state.color }
              onChange={ this.handleChange }
              onChangeComplete={ this.handleChangeComplete } />
          </div>
        : null }
      </div>
    )
  }
}
