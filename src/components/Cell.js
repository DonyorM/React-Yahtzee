import React, { Component } from "react"
import "../styles/Cell.css"

class Cell extends Component{
  cellClick = () => {
    this.props.toggleCell(this.props.id);
  }

  render() {
    let score = this.props.filled ? this.props.score : this.props.potential
    let className = this.props.filled ? "filled" : (this.props.active ? "active" : "empty")
    
    return (
      <td className={`score-cell ${className}`}>
        <div className={`score ${className}`}
            onClick={this.cellClick}
        >
          {score}
        </div>
      </td>
    )
  }
}

export default Cell;
