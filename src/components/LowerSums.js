import React from "react";
import "../styles/Cell.css";

const LowerSums = (props) => {
  function getSum(total, num) {
    return total + num;
  }

  let lowerSum = props.score.slice(6).reduce(getSum)
  let upperSubtotal = props.score.slice(0, 6).reduce(getSum)
  let upperSum = upperSubtotal >= 63 ? upperSubtotal + 35 : upperSubtotal
  let upperComplete = !props.filled.slice(0, 6).includes(false)
  let lowerComplete = !props.filled.slice(6).includes(false) 
  return (
    <>
      <tr>
        <td>Upper Total</td>
        <td> ⇒ </td>
        <td className={upperComplete ? " filled" : " incomplete" }>
          {upperSum}
        </td>
      </tr>
      <tr>
        <td>Lower Total</td>
        <td> ⇒ </td>
        <td className={lowerComplete ? " filled" : " incomplete"}>
          {lowerSum} 
        </td>
      </tr>
      <tr>
        <td>Grand Total</td>
        <td> ⇒ </td>
        <td className={(upperComplete && lowerComplete) ? " filled" : " incomplete"}>
          {upperSum + lowerSum}</td>
      </tr>
    </>
  )
}

export default LowerSums;
