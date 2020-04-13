import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAj3xn9P6r_FKr6FVat7zNn3_hAoGW8WZU",
    authDomain: "yahtzee-manila.firebaseapp.com",
    databaseURL: "https://yahtzee-manila.firebaseio.com",
    projectId: "yahtzee-manila",
    storageBucket: "yahtzee-manila.appspot.com",
    messagingSenderId: "742544910012",
    appId: "1:742544910012:web:cce259ee7e8135c6dc12b9"
};

firebase.initializeApp(firebaseConfig);

export {firebase as default};
