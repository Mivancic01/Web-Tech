import firebase from "firebase/app";
import "firebase/database";
require("firebase/auth");

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

const fb = firebase.initializeApp(firebaseConfig);
let database = firebase.database();
let ref = database.ref();

let addUser = (name, surname, date, email, password ) => {
  let ref = database.ref("users");
  ref.push({
    name: name,
    surname: surname,
    date: date,
    email: email
  });
}

let updateUser = (name, surname, date, email ) => {
  let ref = database.ref("users");
  ref.orderByChild("value").on("child_added", function(snapshot) {
    if (snapshot.val().name === name) {
      ref.child(snapshot.key).update({
        name: name,
        surname: surname,
        date: date,
        email: email
      }).then(r => r);
    }
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.fileName);
  });



}

let addFriend = (user, friendName, friendSurname, friendEmail ) => {
  let ref = database.ref("users");
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

let updateFriendByName = (user, friendName, friendSurname, friendEmail ) => {

  let ref = database.ref("users");
  ref.orderByChild("value").on("child_added", function(snapshot) {
    if (snapshot.val().name === user) {
      let refFriend = database.ref("users/" + snapshot.key + "/friends");
      refFriend.orderByChild("value").on("child_added", function(snapshotTwo) {
        if (snapshotTwo.val().friendName === friendName) {
          refFriend.child(snapshotTwo.key).update({
            friendName: friendName,
            friendSurname: friendSurname,
            friendEmail: friendEmail
          }).then(r => r);
        }
      });
    }
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.fileName);
  });


}

let addNotes = (numberId, userEmail, noteTitle, noteText, noteColor, noteImage ) => {

  let ref = database.ref("users");
  ref.orderByChild("value").on("child_added", function(snapshot) {
    if (snapshot.val().email === userEmail) {
//    if (snapshot.val().name === user) {
      ref.child(snapshot.key).child("notes").push({
        numberId: numberId,
        noteTitle: noteTitle,
        noteText: noteText,
        noteColor: noteColor,
        noteImage: noteImage,
        complete: false
      });
      console.log("add notes");
    }
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.fileName);
  });

}

let readNotes = (userEmail, callback) => {
  database.ref("users").orderByChild("value").on("child_added",  (snapshot) => {
    if (snapshot.val().email === userEmail) {
        var notesArr = [];
        var count = 1;
        snapshot.child("notes").forEach((s) => {
            var indvNote = {};
            indvNote["id"] = s.val().numberId;
            count = count + 1;
            indvNote["color"] = s.val().noteColor;
            indvNote["text"] = s.val().noteText;
            indvNote["title"] = s.val().noteTitle;
            indvNote["image"] = s.val().noteImage;
            indvNote["complete"] = s.val().complete;
//            console.log("s.key()");
//            console.log(s.key())
            notesArr.push(indvNote);
        });
        console.log("read notes");
        callback(notesArr);
    }
  },  (errorObject) => {
    console.log("The read failed: " + errorObject.fileName);
  });
}

let toggleNote = (numberId, userEmail) => {
    let ref = database.ref("users");
      ref.orderByChild("value").on("child_added", function(snapshot) {
        if (snapshot.val().email === userEmail) {
          let refFriend = database.ref("users/" + snapshot.key + "/notes");
          refFriend.orderByChild("value").on("child_added", (snapshotTwo) => {
            if (snapshotTwo.val().numberId === numberId) {
              refFriend.child(snapshotTwo.key).update({
                complete: !snapshotTwo.val().complete
//                friendSurname: friendSurname,
//                friendEmail: friendEmail
              }).then(r => r);
            }
          });
        }
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.fileName);
      });
}


let loggedUser = (callback) => {
    var user = fb.auth().currentUser;
        if (user) {
            callback({"success": true, "user": user});
        }
        else{
            callback({"success": false});
        }
}


let userLoggedOut = (callback) => {
    fb.auth().signOut()
    .then(() => {
      // Sign-out successful.
      console.log("User signed out success");
//      this.view.bindSignoutSuccess();
//      this.model.readAllNotes();
//      this.onNoteListChanged(this.model.notes);
        callback({"success": true, "message": ""});
    }).catch((error) => {
      // An error happened.
      var errorCode = error.code;
        var errorMessage = error.message;
        console.log("User signed out error");
        console.log(errorMessage);
        callback({"success": false, "message": error.message});
//        this.view.bindSignoutError(errorMessage);
    });
}

let userSingUp = (name, secondName, email, password, callback) => {
    fb.auth().createUserWithEmailAndPassword(email, password)
    .then((user) => {
//       Signed in
      addUser(name, secondName, "",email);
      console.log("User signed in");
      console.log(user);
//      this.view.userSignedin(email);
//      this.view.displayNotes([]);
//      this.model.notes = [];
        callback({"success": true, "message": ""});
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("Error");
      console.log(errorMessage);
      callback({"success": false, "message": error.message});
//      this.view.displaySigninError(errorMessage);
    });
}

let userSingIn = (email, password, callback) => {
    fb.auth().signInWithEmailAndPassword(email, password)
    .then((user) => {
       // Signed in
        callback({"success": true, "message": ""});
     })
     .catch((error) => {
       var errorCode = error.code;
       var errorMessage = error.message;
       console.log("Error");
       callback({"success": false, "message": error.message});
     });
 }

let updateNotes = (numberId, userEmail, newNoteText ) => {
    let ref = database.ref("users");
      ref.orderByChild("value").on("child_added", function(snapshot) {
        if (snapshot.val().email === userEmail) {
          let refFriend = database.ref("users/" + snapshot.key + "/notes");
          refFriend.orderByChild("value").on("child_added", (snapshotTwo) => {
            if (snapshotTwo.val().numberId === numberId) {
              refFriend.child(snapshotTwo.key).update({
                noteText: newNoteText
//                friendSurname: friendSurname,
//                friendEmail: friendEmail
              }).then(r => r);
            }
          });
        }
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.fileName);
      });
}

let deleteNotes = (numberId, userEmail ) => {
    let ref = database.ref("users");
      ref.orderByChild("value").on("child_added", function(snapshot) {
        if (snapshot.val().email === userEmail) {
          let refFriend = database.ref("users/" + snapshot.key + "/notes");
          refFriend.orderByChild("value").on("child_added", (snapshotTwo) => {
            if (snapshotTwo.val().numberId === numberId) {
              refFriend.child(snapshotTwo.key).remove().then(r => r);
            }
          });
        }
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.fileName);
      });
}


export {
  addUser,
  addFriend,
  addNotes,
  updateUser,
  updateFriendByName,
  readNotes,
  updateNotes,
  deleteNotes,
  toggleNote,
  loggedUser,
  userLoggedOut,
  userSingUp,
  userSingIn
};
