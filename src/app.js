import React, {
    Component,
    useState,
    useEffect
} from "react";
import "./styles/app.css";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import DiceContainer from './containers/DiceContainer.js';
import firebase from "./firebase";

const firebaseui = require("firebaseui");

const App = () => {
    const [userAuth, setUserAuth] = useState(null);
    const [textVal, setTextVal] = useState("");
    useEffect(() => {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                setUserAuth(user);
            } else {
                // No user is signed in.
            }
        });
    }, []);
    const uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                console.log(authResult);
                setUserAuth(authResult);
                return false;
            },
        },
        credentialHelper: firebaseui.auth.CredentialHelper.NONE,
        signInOptions: [
            {
                provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
                requireDisplayName: false
            }
        ],
        // Other config options...
    };

    const signOut = () => {
        firebase.auth().signOut();
        setUserAuth(null);
    };

    const setDisplayName = (name) => {
        firebase.auth().currentUser.updateProfile({
            displayName: name
        });
        const newAuth = {...userAuth};
        newAuth.displayName = name;
        setUserAuth(newAuth);
    };

    return (
        <div className = "App" >
        {userAuth ?
         (userAuth.displayName ?
          <DiceContainer username={userAuth.displayName} signOut={signOut} />
          :
          (<div>
             <input type="text" value={textVal} onChange={(evt) => setTextVal(evt.target.value)} />
            <button onClick={() => setDisplayName(textVal)}>Set Username</button>
          </div>)
         )
         :
         <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
        }
        </div>
    );
};

export default App;
