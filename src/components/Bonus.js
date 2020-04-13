import React from "react";

const Bonus = (props) => {
  return (
    <tr>
      <td>YAHTZEE Bonus</td>
      <td>Score 100 Each</td>
      <td>{props.yahtzees}</td>
    </tr>
  )
}

export default Bonus;
