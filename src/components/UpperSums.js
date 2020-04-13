import React from "react";
import "../styles/Cell.css";

const UpperSums = (props) => {

  function getSum(total, num) {
    return total + num;
  }

  let subtotal = props.score.slice(0, 6).reduce(getSum)
  let complete = !props.filled.slice(0, 6).includes(false)
  let bonus = subtotal >= 63 ? 35 : 0;
  return (
    <>
      <tr>
        <td>Subtotal</td>
        <td>Total of All Scores</td>
        <td className={complete ? " filled" : " gray" }>
          {subtotal}
        </td>
      </tr>
      <tr>
        <td>Bonus</td>
        <td>(If Subtotal > 63)</td>
        <td className={complete ? " filled" : " incomplete"}>
          {bonus} 
        </td>
      </tr>
      <tr>
        <td>Total</td>
        <td>Subtotal + Bonus</td>
        <td className={complete? " filled" : " incomplete"}>
          {subtotal + bonus}</td>
      </tr>
    </>
  )
}

export default UpperSums;
