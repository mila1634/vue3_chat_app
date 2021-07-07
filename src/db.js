import firebase from "firebase/app";
import "firebase/database";

const config = {
	apiKey: "AIzaSyAEAU0rngbKyzBK3e2mfXmG3VrccVS0GCQ",
    authDomain: "firevuechat-6838d.firebaseapp.com",
    projectId: "firevuechat-6838d",
    storageBucket: "firevuechat-6838d.appspot.com",
    messagingSenderId: "73462857923",
    appId: "1:73462857923:web:d6af256ad372b70c1b6276"
}

const db = firebase.initializeApp(config);
export default db;