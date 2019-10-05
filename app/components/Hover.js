import React from 'react'
import Tooltip from './Tooltip'

export default class Hover extends React.Component {
  state = {
    hovering: false
  }

  mouseOver = () => {
    this.setState({
      hovering: true
    })
  }

  mouseOut = () => {
    this.setState({
      hovering: false
    })
  }

  render() {
    const { hovering } = this.state

    return (
      <div onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>
        {this.props.children(hovering)}
      </div>
    )
  }
}
