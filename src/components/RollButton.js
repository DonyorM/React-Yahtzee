import React, { Component } from "react";
import "../styles/DiceContainer.css";

const RollButton = (props) => {
	return (
		<button id="roll-btn"
			className={`roll-button${props.roll === 3? ' reroll' : ''}`}
			      onClick={props.handleRollClick}
            disabled={!props.active}>
			{props.gameOver ? 'NEW GAME' 
			: (props.roll === 3? 'DONE!' : 'ROLL!')}
		</button>
	);
}

export default RollButton;
