import React, { Component } from "react"
import {hot} from "react-hot-loader"
import Rows from "../components/Rows.js"
import UpperSums from "../components/UpperSums.js"
import LowerSums from "../components/LowerSums.js"
import "../styles/ScoreTable.css"

class TableContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: [false, false, false, false, false, false, false,
               false, false, false, false, false, false],
      potential: [0,0,0,0,0,0,0,0,0,0,0,0,0],
      filled: [false, false, false, false, false, false, false,
               false, false, false, false, false, false],
      score: [0,0,0,0,0,0,0,0,0,0,0,0,0],
    }
    this.toggleCell = this.toggleCell.bind(this)
  }

  toggleCell(id) {
    let fills = this.state.filled;
    let scores = this.state.score;
    !this.state.filled[id] && 
      (fills[id] = true, 
        scores[id] = this.state.potential[id])
    this.setState ({
      filled: fills,
      score: scores
    })
    //call to props function turnHandler via diceContainer
  }

  // triggered when dice change
	componentDidUpdate(prevProps) {
		if (this.props.pips !== prevProps.pips) {
      this.checkDice(this.props.pips)
		}
	}

  // determine what scoring options are available for user and
  // calculate their values
	checkDice(pips) {
		let newActive = [...this.state.active];
		let newPotential = [...this.state.potential];
		for (let i = 0; i <= 5; i++) {
			let count = pips.filter(x => x===i).length;
			pips.includes(i) ? (
				newActive[i] = true,
				newPotential[i] = count*(i+1)
			) : (  
				newActive[i] = false,
				newPotential[i] = 0 )
    }

    let diceObject = {}
    let diceSum = 0
    // Extract pips array into an object where keys represent 
    // dice faces and values represent the number of times 
    // each face is showing. Keys are sorted in ascending order.
    pips.forEach(dice => {
      diceObject[dice] = (diceObject[dice] || 0)+1
      diceSum = diceSum + dice + 1 
    })

    let pair = Object.values(diceObject).includes(2)
    let triple = Object.values(diceObject).includes(3)
    let quadruple = Object.values(diceObject).includes(4)
    let yahtzee = Object.values(diceObject).includes(5)

    let faces = Object.keys(diceObject)

    let fiveConsecutive = 
      (faces.length === 5 && faces[4] - faces[0] === 4)

    let fourConsecutive =
      ((faces.length === 5 && 
        (faces[4] - faces[1] === 3 || faces[3] - faces[0] === 3)) ||
        (faces.length === 4 && faces[3] - faces[0] === 3))
    /*
    triple && (newActive[0] = true)
    quadruple && (newActive[0] = true, newActive[1] = true)
    yahtzee && (newActive[0] = true, newActive[1] = true, newActive[5] = true)
    (triple && pair) && (newActive[2] = true )
    fourConsecutive && (newActive[3] = true)
    fiveConsecutive && (newActive[4] = true)
    */
    newActive[6] = triple || quadruple || yahtzee
    newActive[7] = quadruple || yahtzee
    newActive[8] = triple && pair
    newActive[9] = fourConsecutive
    newActive[10] = fiveConsecutive
    newActive[11] = yahtzee
    newActive[12] = (this.props.roll === 3)

    newActive[6] ? (newPotential[6] = diceSum) : (newPotential[6] = 0)
    newActive[7] ? (newPotential[7] = diceSum) : (newPotential[7] = 0)
    newActive[8] ? (newPotential[8] = 25) : (newPotential[8] = 0)
    newActive[9] ? (newPotential[9] = 30) : (newPotential[9] = 0)
    newActive[10] ? (newPotential[10] = 40) : (newPotential[10] = 0)
    newActive[11] ? (newPotential[11] = 50) : (newPotential[11] = 0)
    newActive[12] ? (newPotential[12] = diceSum) : (newPotential[12] = 0)

    this.setState((state) => ({ active: newActive }))
		this.setState((state) => ({ potential: newPotential }))
  }

  render() {
    return (
      <div className="scorecard-canvas">
        <table className="upper-scorecard">
          <th colSpan="2">Upper Section</th>
          <th>Score</th>
            <Rows items={UPPER_ITEMS}
                  active={this.state.active}
                  potential={this.state.potential}
                  filled={this.state.filled}
                  score={this.state.score}
                  toggleCell={this.toggleCell} />
            <UpperSums score={this.state.score} filled={this.state.filled}/>
        </table>
        <table className="upper-scorecard">
          <th colSpan="2">Upper Section</th>
          <th>Score</th>
            <Rows items={LOWER_ITEMS}
                  active={this.state.active}
                  potential={this.state.potential}
                  filled={this.state.filled}
                  score={this.state.score}
                  toggleCell={this.toggleCell} />
            <LowerSums score={this.state.score} filled={this.state.filled}/> */}
        </table>
      </div>
    )
  }
}

const UPPER_ITEMS = [
  {name: 'Aces', description: 'Total of all Aces', index: 0},
  {name: 'Twos', description: 'Total of all Twos', index: 1},
  {name: 'Threes', description: 'Total of all Threes', index: 2},
  {name: 'Fours', description: 'Total of all Fours', index: 3},
  {name: 'Fives', description: 'Total of all Fives', index: 4},
  {name: 'Sixes', description: 'Total of all Sixes', index: 5},
]

const LOWER_ITEMS = [
  {name: 'Three of a Kind', description: 'Total of all Dice', index: 6},
  {name: 'Four of a Kind', description: 'Total of all Dice', index: 7},
  {name: 'Full House', description: 'Score 25', index: 8},
  {name: 'Small Straight', description: 'Score 30', index: 9},
  {name: 'Large Straight', description: 'Score 40', index: 10},
  {name: 'YAHTZEE', description: 'Score 50', index: 11},
  {name: 'Chance', description: 'Total of All Dice', index: 12},
  {name: 'Bonus YAHTZEES', description: 'Score 100 each', index: 13},
]

export default hot (module)(TableContainer);