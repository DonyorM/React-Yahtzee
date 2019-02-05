import React, { Component } from "react";
import {hot} from "react-hot-loader";
import { isNullOrUndefined } from "util";
import Calculator from './Calculator.js';
import "../styles/ScoreTable.css";

const Score = (props) => {
	var total = 0;
		props.pips.forEach((pips) => {
			total = total + pips + 1;
		});
		return (
			<h1 className="score-count">Your {props.roll === 3 ? 'final' : ''} total is {total}</h1>
		)
}

class Scorecard extends Component {
  render() {
    return(
      <div className="scorecard-canvas">
        <table className="upper-scorecard">
          <th>
            Upper Section
          </th>
          <th>Score</th>
          {/* <Calculator pips={this.props.pips} /> */}
            <SectionRows items={this.props.upperItems}/>
        </table>
        <table className="lower-scorecard">
          <th colSpan="2">
            Lower Section
          </th>
          <th>Score</th>
            <SectionRows items={this.props.lowerItems}/>
        </table>
      </div>
    );
  }
}

class ItemRow extends Component {
  render() {
    const item = this.props.item;
    
    return (
    <tr>
      <td>{item.name}</td>
      <td>{item.description}</td>
      <td>{item.score}</td>
    </tr>
    );
  }
}

class SectionRows extends Component {
  render() {
    const rows = [];
    
    this.props.items.forEach((item) => {
      rows.push(
        <ItemRow
          item={item}
          key={item.name} />
      );
    });

    return (
        rows
    );
  }
}

class ScoreTable extends Component {
  render() {
    return (
      <div>
        <Scorecard pips={this.props.pips}
                    upperItems={UPPER_ITEMS}
                    lowerItems={LOWER_ITEMS} />
        <Score pips={this.props.pips} roll={this.props.roll}/>
      </div>
    );
  }
}

const UPPER_ITEMS = [
  {name: 'Aces', description: 'Total of all Aces', score: isNullOrUndefined},
  {name: 'Twos', description: 'Total of all Twos', score: isNullOrUndefined},
  {name: 'Threes', description: 'Total of all Threes', score: isNullOrUndefined},
  {name: 'Fours', description: 'Total of all Threes', score: isNullOrUndefined},
  {name: 'Fives', description: 'Total of all Threes', score: isNullOrUndefined},
  {name: 'Sixes', description: 'Total of all Threes', score: isNullOrUndefined},
  {name: 'Subtotal', description: 'Total of all Scores', score: isNullOrUndefined},
  {name: 'Bonus (If Subtotal > 63)', description: 'Score 35', score: 35, fulfilled: false},
  {name: 'Total', description: 'Subtotal + Bonus', score: isNullOrUndefined},
];

const LOWER_ITEMS = [
  {name: 'Three of a Kind', description: 'Total of All Dice', score: isNullOrUndefined},
  {name: 'Four of a Kind)', description: 'Total of All Dice', score: isNullOrUndefined},
  {name: 'Full House', description: 'Score 25', score: 25, fulfilled: false},
  {name: 'Small Straight (Sequence of 4)', description: 'Score 30', score: 50, fulfilled: false},
  {name: 'Large Straight (Sequence of 5)', description: 'Score 40', score: 50, fulfilled: false},
  {name: 'YAHTZEE', description: 'Score 50', score: 50, fulfilled: false},
  {name: 'Chance', description: 'Total of All Dice', score: isNullOrUndefined},
  {name: 'YAHTZEE Bonus (Additional YAHTZEEs)', description: 'Score 100', score: 100, fulfilled: false},
  {name: 'Upper Total', description: ' ⇒ ', score: isNullOrUndefined},
  {name: 'Lower Total', description: ' ⇒ ', score: isNullOrUndefined},
  {name: 'Grand Total', description: 'Upper Total + Lower Total', score: isNullOrUndefined},
];


export default hot (module)(ScoreTable);