import React from "react"

const RollCount = (props) => {
  return (
    <div className="roll-count">
      <h2>
        ROLLS
        <br/>
        REMAINING
      </h2>
      <h1>
        {3 - props.roll}
      </h1>
    </div>
  )
}

export default RollCount;
