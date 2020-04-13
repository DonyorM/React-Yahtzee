import React, { Component } from "react"
import Cell from "../components/Cell.js"

const Rows = (props) => {
  const rows = []
    props.items.forEach((item) => {
      rows.push(
      <tr>
        <td>{item.name}</td>
        <td>{item.description}</td>
        <Cell id={item.index}
              active={props.active[item.index]} 
              potential={props.potential[item.index]}
              filled={props.filled[item.index]}
              score={props.score[item.index]} 
              toggleCell={props.toggleCell}/>
      </tr>
      )
    })

  return (rows)
}

export default Rows;
