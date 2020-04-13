import React, {
    Component
} from "react";
import RollButton from "../components/RollButton.js";
import RollCount from "../components/RollCount.js";
import Dice from "../components/Dice.js";
import GameOver from "../components/GameOver.js";
import TableContainer from "./TableContainer.js";
import Modal from "../components/Modal.js";
import "../styles/DiceContainer.css";
import firebase from "../firebase.js";

const db = firebase.firestore();

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

class DiceContainer extends Component {
    state = {
        roll: 0,
        pips: [0, 0, 0, 0, 0],
        hold: [false, false, false, false, false],
        rollClicked: true,
        tableClicked: {},
        gameOver: false,
        players: [],
        currentUser: "",
    }

    gameOver = () => {
        //This is called after every player finishes (and can be used to set finishing features)
        //However the counter is moved to the next player before this is called, so it
        //checks if the current player is the first player, which indicates every player
        //has finished.
        console.log("Game over player: " + this.state.currentUser);
        if (this.state.players.indexOf(this.state.currentUser) === this.state.players.length - 1) {
            console.log("It's game over");
            this.firebaseState({
                gameOver: true
            });
        }
    }

    firebaseState(state, callback) {
        this.setState(state, callback);
        const gameRef = db.collection("games").doc("game");
        gameRef.get().then((doc) => {
            if (doc.exists) {
                gameRef.update(state);
            } else if (state && !isEmpty(state)) {
                gameRef.set(state);
            }
        });
    }

    setNextPlayer = () => {
        const players = this.state.players;
        const index = players.indexOf(this.state.currentUser);
        let next;
        if (index === players.length - 1) {
            next = players[0];
        } else {
            next = players[index + 1];
        }
        db.collection("games").doc("game").update({currentUser: next});
    }

    componentDidMount() {
        const me = this;
        const game = db.collection("games").doc("game");
        game.onSnapshot(function(doc) {
            me.setState(doc.data());
        });
        game.get().then((gameData) => {
            if (gameData.exists) {
                const data = gameData.data();
                if (!data.players.includes(me.props.username)) {
                    const newPlayers = data.players.slice();
                    newPlayers.push(me.props.username);
                    game.update({
                        players: newPlayers
                    });
                }
            } else {
                game.set({
                    players: [me.props.username],
                    currentUser: me.props.username
                });
            }
        });
    }

    // (callback from Dice.js)
    toggleDiceHold = (id) => {
        if (this.state.currentUser === this.props.username) {
            if (this.state.roll !== 0) {
                let holds = this.state.hold;
                holds[id] = !holds[id];
                this.firebaseState({
                    hold: holds
                });
            }
        }
    }

    // (callback from TableContainer.js)
    handleTableChange = () => {
        const newTableClicked = {...this.state.tableClicked};
        newTableClicked[this.state.currentUser] = true;
        this.firebaseState({
            tableClicked: newTableClicked,
            rollClicked: false,
            roll: 3
        });
        this.setNextPlayer();
    }

    // (callback from RollButton.js)
    handleRollClick = () => {
        let previousPlayerIndex = this.state.players.indexOf(this.state.currentUser) - 1;
        if (previousPlayerIndex < 0) {
            previousPlayerIndex = this.state.players.length - 1;
        }
        if (this.state.gameOver) {
            this.newGame();
        } else if (this.state.roll === 3 && this.state.currentUser === this.props.username) {
            this.newTurn();
        } else if (this.state.roll != 3) {
            this.newRoll();
        }
    }

    resetTables = () => {
        db.collection("tables").get().then((response) => {
            let batch = db.batch();
            response.docs.forEach((doc) => {
                console.log("updating " + doc.id);
                const docRef = db.collection("tables").doc(doc.id);
                batch.update(docRef, {
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
                    whatDiceDoIHave: {}
                });
            });
            batch.commit();
        });
    };

    newGame = () => {
        this.resetTables();
        this.firebaseState({
            roll: 0,
            pips: [0, 0, 0, 0, 0],
            hold: [false, false, false, false, false],
            rollClicked: true,
            tableClicked: {},
            gameOver: false,
            player: this.state.players,
            currentUser: this.state.players[0] ? this.state.players[0] : ""
        });
    }

    newTurn = () => {
        const newTableClicked = {...this.state.tableClicked};
        delete newTableClicked[this.state.currentUser];
        this.firebaseState({
            roll: 1,
            hold: [false, false, false, false, false],
            rollClicked: true,
            tableClicked: newTableClicked
            },
            () => {
                this.rollDice();
            });
    }

    newRoll = () => {
        const rollCount = this.state.roll;
        this.firebaseState({
            roll: rollCount + 1
        });
        this.rollDice();
    }

    rollDice = () => {
        let newPips = [...this.state.pips];
        for (let i = 0; i < 5; i++) {
            if (!this.state.hold[i]) {
                const num = Math.floor(Math.random() * 6);
                newPips[i] = num;
            }
        }
        this.firebaseState({
            pips: newPips
        });
    }

    reset = () => {
        //This shouldn't go to firebase
        this.setState({
            modalTrigger: true,
            closeModal: () => this.setState({modalTrigger: false}),
            submitModal: () => {this.setState({modalTrigger: false});
                                this.newGame();},
            modalMessage: "Are you sure you want to create a new game. All progress will be lost."
        });
    }

    render() {
            return ( <
                div className = "app-container" >
                       <div className="nav">
                         <button onClick={() => this.reset()}>Reset</button>
                     <button onClick={() => firebase.auth().signOut()}>Sign Out</button></div>
                <
                div className = "dice-area" >
                <
                div className = "dice-bar" >
                <
                Dice id = {
                    0
                }
                pips = {
                    this.state.pips[0]
                }
                hold = {
                    this.state.hold[0]
                }
                toggleDiceHold = {
                    this.toggleDiceHold
                }
                /> <
                Dice id = {
                    1
                }
                pips = {
                    this.state.pips[1]
                }
                hold = {
                    this.state.hold[1]
                }
                toggleDiceHold = {
                    this.toggleDiceHold
                }
                /> <
                Dice id = {
                    2
                }
                pips = {
                    this.state.pips[2]
                }
                hold = {
                    this.state.hold[2]
                }
                toggleDiceHold = {
                    this.toggleDiceHold
                }
                /> <
                Dice id = {
                    3
                }
                pips = {
                    this.state.pips[3]
                }
                hold = {
                    this.state.hold[3]
                }
                toggleDiceHold = {
                    this.toggleDiceHold
                }
                /> <
                Dice id = {
                    4
                }
                pips = {
                    this.state.pips[4]
                }
                hold = {
                    this.state.hold[4]
                }
                toggleDiceHold = {
                    this.toggleDiceHold
                }
                /> < /
                div > <
                div >
                <
                div className = "roll-area" >
                <
                div className = "roll-canvas" >
                <
                GameOver gameOver = {
                    this.state.gameOver
                }
                /> <
                RollButton roll = {
                    this.state.roll
                }
                handleRollClick = {
                    this.handleRollClick
                }
                gameOver = {
                    this.state.gameOver
                }
                           active = {this.state.currentUser === this.props.username}
                /> <
                RollCount roll = {
                    this.state.roll
                }
                /> < /
                div > <
                /div> <
                      div className="card-container"> {
                    this.state.players.map((player, index) => <
                        TableContainer pips = {
                            this.state.pips
                        }
                        roll = {
                            this.state.roll
                        }
                        handleTableChange = {
                            this.handleTableChange
                        }
                        rollClicked = {
                            this.state.rollClicked
                        }
                        tableClicked = {
                            this.state.tableClicked[player]
                        }
                        gameOver = {
                            this.gameOver
                        }
                        username = {
                            this.props.username
                        }
                        currentUser = {
                            this.state.currentUser
                        }
                        tablePlayer = {
                            player
                        }
                        key = {
                            index
                        }
                        />)} </div > < /
                        div > <
                /div>
                       <Modal modalTrigger={this.state.modalTrigger} submitModal={this.state.submitModal || (() => true)} closeModal={this.state.closeModal || (() => true)} message={this.state.modalMessage}/>< /
                        div >
                    );
                }
            }

            export default DiceContainer;
