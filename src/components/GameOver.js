import React from "react"
import "../styles/DiceContainer.css"

const GameOver = (props) => {
  return (
    <div className={`game${props.gameOver ? '-over' : ''}`}>
      GAME OVER!
      <br/>
      Well done.
    </div>
  )
}

export default GameOver;
