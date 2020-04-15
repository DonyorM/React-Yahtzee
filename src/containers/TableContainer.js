import React, {
    Component
} from "react";
import Rows from "../components/Rows.js";
import UpperSums from "../components/UpperSums.js";
import LowerSums from "../components/LowerSums.js";
import Bonus from "../components/Bonus.js";
import Modal from "../components/Modal.js";
import "../styles/ScoreTable.css";
import firebase from "../firebase";

const db = firebase.firestore();


class TableContainer extends Component {
    state = {
        active: [false, false, false, false, false, false, false,
            false, false, false, false, false, false
        ],
        potential: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        filled: [false, false, false, false, false, false, false,
            false, false, false, false, false, false
        ],
        score: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        yahtzees: '',
        cell_id: null,
        modalTrigger: false,
        modalMessage: '',
        whatDiceDoIHave: {},
    }

    setAlmostDone = () => {
        this.firebaseState({filled: [true, true, true, true, true, true, true,
                            true, true, true, true, false, false]});
    }

    firebaseState = (state, callback) => {
        //Component state set from firebase listener in componentDidMount
        this.setState(state, callback);
        if (this.currentlyPlaying()) {
            const toUpdate = {...state};
            delete toUpdate["modalTrigger"];
            delete toUpdate["modalMessage"];
            const userDoc = db.collection("tables").doc(this.props.tablePlayer);
            userDoc.get().then((doc) => {
                if (doc.exists) {
                    userDoc.update(toUpdate);
                } else if (Object.keys(toUpdate).length > 0) {
                    const {modalTrigger, modalMessage, ...rest} = this.state;
                    userDoc.set(rest);
                }
            });
        }
    };

    currentlyPlaying = () => {
        return this.props.tablePlayer === this.props.currentUser;
    }

    active = () => {
        return this.currentlyPlaying() &&
            this.props.currentUser === this.props.username;
    }

    handleCellClick = (cell_id) => {
        if (this.cellIsClickable(cell_id)) {
            if (this.props.roll < 3 || this.state.potential[cell_id] === 0) {
                this.firebaseState({
                    cell_id: cell_id
                }, () => {
                    this.setModalMessage();
                });
            } else {
                this.firebaseState({
                    cell_id: cell_id
                }, () => {
                    this.toggleCell();
                });
            }
        }
    }

    cellIsClickable = (cell_id) => {
        return (this.active() && this.props.roll !== 0 && !this.props.tableClicked && !this.state.filled[cell_id]);
    }

    setModalMessage = () => {
        const {
            cell_id,
            potential
        } = this.state;
        if (this.props.roll < 3) {
            let message = 'Are you sure you want to end your turn? You can still roll again.';
            potential[cell_id] === 0 &&
                (message += ' (This will result in a score of zero for this item.)');
            this.firebaseState({
                modalMessage: message
            }, () => {
                this.openModal();
            });
        } else if (this.otherCellsHavePotential()) {
            this.firebaseState({
                    modalMessage: 'Are you sure you want to put a zero here? You could score more points elsewhere.'
                },
                () => {
                    this.openModal();
                });
        } else {
            this.toggleCell();
        }
    }

    otherCellsHavePotential = () => {
        for (let i = 0; i < 15; i++) {
            if (!this.state.filled[i] && this.state.potential[i]) {
                return true;
            }
        }
    };

    openModal = () => {
        this.firebaseState({
            modalTrigger: true
        });
    }

    closeModal = () => {
        this.firebaseState({
            modalTrigger: false
        });
    }

    submitModal = () => {
        this.firebaseState({
            modalTrigger: false
        });
        this.toggleCell(this.state.cell_id);
    }

    toggleCell = () => {
        const {
            filled,
            score,
            cell_id,
            potential
        } = this.state;
        const b = this.props.rollClicked &&
            (filled[cell_id] = true, score[cell_id] = potential[cell_id]);
        this.firebaseState({
            filled: filled,
            score: score,
            active: [false, false, false, false, false, false, false,
                     false, false, false, false, false, false]
        });
        this.props.handleTableChange();
    }

    componentDidUpdate = (prevProps) => {
        if (this.props !== prevProps) {
            if (this.props.pips !== prevProps.pips) {
                if (this.currentlyPlaying()) {
                    this.organizeDice();
                }
            } else if (this.props.tableClicked !== prevProps.tableClicked) {
                this.checkComplete();
            }
        }
    }

    componentDidMount()  {
        const me = this;
        db.collection("tables").doc(me.props.tablePlayer).onSnapshot((doc) => {
            if(doc.data() && Object.keys(doc.data()).length > 0) {
                me.setState(doc.data());
            }
        });
    };


    checkComplete = () => {
        !this.state.filled.includes(false) && this.props.gameOver();
    }

    organizeDice = () => {
        let whatDiceDoIHave = {};
        this.props.pips.forEach(dice => {
            whatDiceDoIHave[dice] = (whatDiceDoIHave[dice] || 0) + 1;
        });
        if (this.currentlyPlaying()) {
            this.firebaseState({
                whatDiceDoIHave: whatDiceDoIHave
            }, () => this.activateLowerCells());
        }
    }

    activateLowerCells = () => {
        let newActive = [];
        newActive[6] = this.anyTriples() || this.anyQuadruples() || this.anyYahtzees();
        newActive[7] = this.anyQuadruples() || this.anyYahtzees();
        newActive[8] = this.anyPairs() && this.anyTriples();
        newActive[9] = this.anyFourConsecutive();
        newActive[10] = this.anyFiveConsecutive();
        newActive[11] = this.anyYahtzees();
        newActive[12] = (this.props.roll === 3);
        if (this.anyYahtzees()) {
            this.calculateYahtzeeBonus();
        }
        this.calculateLowerValues(newActive);
    }

    anyPairs = () => {
        return Object.values(this.state.whatDiceDoIHave).includes(2);
    }

    anyTriples = () => {
        return Object.values(this.state.whatDiceDoIHave).includes(3);
    }

    anyQuadruples = () => {
        return Object.values(this.state.whatDiceDoIHave).includes(4);
    }

    anyYahtzees = () => {
        return Object.values(this.state.whatDiceDoIHave).includes(5);
    }

    anyFourConsecutive = () => {
        let sortedPips = Object.keys(this.state.whatDiceDoIHave);
        return (sortedPips.length === 5) && (sortedPips[4] - sortedPips[1] === 3 || sortedPips[3] - sortedPips[0] === 3) ||
            (sortedPips.length === 4 && sortedPips[3] - sortedPips[0] === 3);
    }

    anyFiveConsecutive = () => {
        let sortedPips = Object.keys(this.state.whatDiceDoIHave);
        return sortedPips.length === 5 && (sortedPips[4] - sortedPips[0] === 4);
    }

    calculateLowerValues = (newActive) => {
        let newPotential = [];
        let diceSum = (this.props.pips.reduce((sum, pips) => sum + pips)) + 5;
        newPotential[6] = (newActive[6] ? diceSum : 0);
        newPotential[7] = (newActive[7] ? diceSum : 0);
        newPotential[8] = (newActive[8] ? 25 : 0);
        newPotential[9] = (newActive[9] ? 30 : 0);
        newPotential[10] = (newActive[10] ? 40 : 0);
        newPotential[11] = (newActive[11] ? 50 : 0);
        newPotential[12] = diceSum;
        this.calculateUpperValues(newActive, newPotential);
    }

    calculateUpperValues = (newActive, newPotential) => {
        for (let i = 0; i <= 5; i++) {
            let numberOfDice = this.props.pips.filter(x => x === i).length;
            const a = this.props.pips.includes(i) ? (newActive[i] = true, newPotential[i] = numberOfDice * (i + 1)) :
                (newActive[i] = false, newPotential[i] = 0);
        }
        this.updateTable(newActive, newPotential);
    }

    calculateYahtzeeBonus = () => {
        if (this.state.filled[11]) {
            let bonus = this.state.yahtzees;
            let bonusScore = this.state.score;
            bonus += 'X';
            bonusScore[13] = bonus.length * 100;
            this.firebaseState({
                yahtzees: bonus,
                score: bonusScore
            });
        }
    }

    updateTable = (newActive, newPotential) => {
        this.firebaseState({
            active: newActive,
            potential: newPotential,
        });
    }

    render() {
        return ( <
                 div className = "scorecard-canvas" style={this.props.tablePlayer === this.props.currentUser ? {border: "solid red"} : {}} >
            <
            Modal modalTrigger = {
                this.state.modalTrigger
            }
            closeModal = {
                this.closeModal
            }
            submitModal = {
                this.submitModal
            }
            message = {
                this.state.modalMessage
            }
            />
                   <div className="title">{this.props.tablePlayer}</div>
                   <div className="table-div"><
            table className = "upper-scorecard" >
                 <thead>
                 <tr>
            <
            th colSpan = "2" > Upper Section < /th> <
                 th > Score < /th>
                 </tr>
                 </thead><
            tbody >
            <
            Rows items = {
                UPPER_ITEMS
            }
            active = {
                this.state.active
            }
            potential = {
                this.state.potential
            }
            filled = {
                this.state.filled
            }
            score = {
                this.state.score
            }
            toggleCell = {
                this.handleCellClick
            }
            /> <
            UpperSums score = {
                this.state.score
            }
            filled = {
                this.state.filled
            }
            /> <
            /tbody> <
            /table> <
            table className = "lower-scorecard" >
            <
            th colSpan = "2" > Lower2 Section < /th> <
            th > Score < /th> <
            tbody >
            <
            Rows items = {
                LOWER_ITEMS
            }
            active = {
                this.state.active
            }
            potential = {
                this.state.potential
            }
            filled = {
                this.state.filled
            }
            score = {
                this.state.score
            }
            toggleCell = {
                this.handleCellClick
            }
            /> <
            Bonus yahtzees = {
                this.state.yahtzees
            }
            /> <
            LowerSums score = {
                this.state.score
            }
            filled = {
                this.state.filled
            }
            /> <
            /tbody> <
            /table></div> <
            /div>
        );
    }
}

const UPPER_ITEMS = [{
        name: 'Aces',
        description: 'Total of all Aces',
        index: 0
    },
    {
        name: 'Twos',
        description: 'Total of all Twos',
        index: 1
    },
    {
        name: 'Threes',
        description: 'Total of all Threes',
        index: 2
    },
    {
        name: 'Fours',
        description: 'Total of all Fours',
        index: 3
    },
    {
        name: 'Fives',
        description: 'Total of all Fives',
        index: 4
    },
    {
        name: 'Sixes',
        description: 'Total of all Sixes',
        index: 5
    },
];

const LOWER_ITEMS = [{
        name: 'Three of a Kind',
        description: 'Total of all Dice',
        index: 6
    },
    {
        name: 'Four of a Kind',
        description: 'Total of all Dice',
        index: 7
    },
    {
        name: 'Full House',
        description: 'Score 25',
        index: 8
    },
    {
        name: 'Small Straight',
        description: 'Score 30',
        index: 9
    },
    {
        name: 'Large Straight',
        description: 'Score 40',
        index: 10
    },
    {
        name: 'YAHTZEE',
        description: 'Score 50',
        index: 11
    },
    {
        name: 'Chance',
        description: 'Total of All Dice',
        index: 12
    },
];

export default TableContainer;
