import React, { Component } from "react";
import {hot} from "react-hot-loader";
import Dice from "./Dice.js";
import "./DiceBar.css";

class DiceBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			roll: false,
		}
		this.clickHandler = this.clickHandler.bind(this);
	}

	clickHandler() {
		this.setState({roll: !this.state.roll});
	}

	render () {
		return (
			<div className="dice-area">
				<button id="roll-btn"
							className="roll-button"
							onClick={this.clickHandler}>Roll!</button>
				<div className="dice-bar">
					<Dice roll={this.state.roll} />
					<Dice roll={this.state.roll} />
					<Dice roll={this.state.roll} />
					<Dice roll={this.state.roll} />
					<Dice roll={this.state.roll} />
				</div>
			</div>
		);
	}
}

export default hot (module)(DiceBar);