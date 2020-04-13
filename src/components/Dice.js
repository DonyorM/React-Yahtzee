import React, {Component} from "react";

// import images of dice faces
import one from '../images/one.png';
import two from '../images/two.png';
import three from '../images/three.png';
import four from '../images/four.png';
import five from '../images/five.png';
import six from '../images/six.png';

class Dice extends Component {
	holdDice = () => {
		this.props.toggleDiceHold(this.props.id);
	}

	render () {
		const diceImages = [one, two, three, four, five, six]
		return (
			<div className={`dice-container ${this.props.hold ? "hold" : "free"}`}>
				<img src={diceImages[this.props.pips]} onClick={this.holdDice} />
			</div>
		)
	}
}
export default Dice;
