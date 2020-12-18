import firebase from "firebase/app";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDmdNGCGoFGQ04AQz4R5_pd4DtKg8Uc2vM",
  authDomain: "webapp-f1ae4.firebaseapp.com",
  databaseURL: "https://webapp-f1ae4-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "webapp-f1ae4",
  storageBucket: "webapp-f1ae4.appspot.com",
  messagingSenderId: "683996957577",
  appId: "1:683996957577:web:cf51bb1505c3eb36d4af58",
  measurementId: "G-8SB629Q2HS"
};

firebase.initializeApp(firebaseConfig);
let database = firebase.database();
let ref = database.ref();

let addUser = (name, surname, date, email ) => {
  ref.child("users").push({
    name: name,
    surname: surname,
    date: date,
    email: email
  });
}

let updateUser = (name, surname, date, email ) => {}

let addFriend = (user, friendName, friendSurname, friendEmail ) => {
  ref.orderByChild("value").on("child_added", function(snapshot) {
    if (snapshot.val().name === user) {
      ref.child(snapshot.key).child("friends").push({
        friendName: friendName,
        friendSurname: friendSurname,
        friendEmail: friendEmail
      });
    }
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.fileName);
  });
}

let updateFriend = (user, friendName, friendSurname, friendEmail ) => {}

let addNotes = (user, noteTitle, noteText, noteColor ) => {
  ref.orderByChild("value").on("child_added", function(snapshot) {
    if (snapshot.val().name === user) {
      ref.child(snapshot.key).child("notes").push({
        noteTitle: noteTitle,
        noteText: noteText,
        noteColor: noteColor
      });
    }
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.fileName);
  });

}

let updateNotes = (user, noteTitle, noteText, noteColor ) => {}


export {
  addUser,
  addFriend,
  addNotes,
};
