/**
 * @class Controller
 *
 * Links the user input and the view output.
 *
 * @param model
 * @param view
 */

import {
  addFriend,
  addUser,
  updateUser,
  updateFriendByName,
  fb,
  addNotes,
  readNotes,
  updateNotes,
  deleteNotes
} from '../service/firebase.service';

export class Controller {


  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Explicit this binding
    this.model.bindNoteListChanged(this.onNoteListChanged);
    this.view.bindAddNote(this.handleAddNote);
    this.view.bindEditNote(this.handleEditNote)
    this.view.bindDeleteNote(this.handleDeleteNote);
    this.view.bindToggleNote(this.handleToggleNote);
    this.view.bindSigninForm();
    this.view.bindSigninSubmit(this.handleSigninSubmit);
    this.view.bindSignupForm();
    this.view.bindSignupSubmit(this.handleSignupSubmit);

    this.handleSignedinUser();
    this.view.bindSignoutUser(this.handleSignoutUser);
    // Display initial notes
    this.onNoteListChanged(this.model.notes);
  }

  handleSignedinUser = () => {
    var user = fb.auth().currentUser;
    if (user) {
      // User is signed in.
      this.view.bindSignoutUnsuccess();
    } else {
      // No user is signed in.
      fb.auth().signOut()
      .catch((error) => {
            // An error happened.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("User signed out error");
            console.log(errorMessage);
            this.view.bindSignoutError(errorMessage);
          });
      this.view.bindSignoutSuccess();
    }
  }

  handleSignoutUser = () => {
  var userLoggedout = false;
    fb.auth().signOut().
    then(() => {
      // Sign-out successful.
      console.log("User signed out success");
      this.view.bindSignoutSuccess();
      this.model.readAllNotes();
      this.onNoteListChanged(this.model.notes);
    }).catch((error) => {
      // An error happened.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("User signed out error");
      console.log(errorMessage);
      this.view.bindSignoutError(errorMessage);
    });

  }

  handleSigninSubmit = (email, password) => {
  console.log("signin");
    fb.auth().signInWithEmailAndPassword(email, password)
//    fb.auth().createUserWithEmailAndPassword(email, password)
    .then((user) => {
      // Signed in
      console.log("User signed in");
      console.log(user);
//      this.handleSignedinUser();
        this.view.userSignedin(email);
        readNotes(email, (notesFromDB) => {
            console.log(notesFromDB);
            this.view.displayNotes(notesFromDB);
            this.model.notes = notesFromDB;
        });
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("Error");
      console.log(errorMessage);
      this.view.displaySigninError(errorMessage);
    });
  }

  handleSignupSubmit = (name, secondName, email, password) => {
    console.log("signup");
    addUser(name, secondName, "",email);
//    addNotes(email, "noteTitle", "noteText", "red" );
    fb.auth().createUserWithEmailAndPassword(email, password)
    .then((user) => {
      // Signed in
      console.log("User signed in");
      console.log(user);
      this.view.userSignedin(email);
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("Error");
      console.log(errorMessage);
      this.view.displaySigninError(errorMessage);
    });
  }

  onNoteListChanged = (notes) => {
    this.view.displayNotes(notes);
  }

  //handleAddUser = (noteTitle, noteText, noteColor) => {
  //  addUser(noteTitle, noteText, noteColor, "emailEmail")
  //  this.model.addNote(noteTitle, noteText, noteColor);
  //}

  handleAddNote = (noteTitle, noteText, noteColor) => {
    //addUser("23", noteText, noteColor, "emailEmail")
    //console.log("inside " + noteTitle + " " + noteText + " " + noteColor)
    //updateUser(noteTitle, noteText, noteColor, "bla")
    //updateFriendByName("noteTitle", "momo", "laaaaaaa", "email@asd")
    //addFriend("noteTitle", "novi", "meme", "email")
    var user = fb.auth().currentUser;
    if (user) {
      // User is signed in.
      addNotes(this.model.notes.length, user.email, noteTitle, noteText, noteColor );
      readNotes(user.email, (notesFromDB) => {
          console.log(notesFromDB);
          this.view.displayNotes(notesFromDB);
          this.model.notes = notesFromDB;
      });
    } else {
      // No user is signed in.
     this.model.addNote(noteTitle, noteText, noteColor);
    }
  }

  handleEditNote = (id, todoText) => {
  var user = fb.auth().currentUser;
      if (user) {
        // User is signed in.
        updateNotes(id, user.email, todoText );
        readNotes(user.email, (notesFromDB) => {
            console.log(notesFromDB);
            this.view.displayNotes(notesFromDB);
            this.model.notes = notesFromDB;
        });
      } else {
        // No user is signed in.
       this.model.editNote(id, todoText);
      }
  }

  handleDeleteNote = (id) => {
    var user = fb.auth().currentUser;
      if (user) {
        // User is signed in.
        deleteNotes(id, user.email );
        readNotes(user.email, (notesFromDB) => {
            console.log(notesFromDB);
            this.view.displayNotes(notesFromDB);
            this.model.notes = notesFromDB;
        });
      } else {
        // No user is signed in.
       this.model.deleteNote(id);
      }
  }

  handleToggleNote = (id) => {
    this.model.toggleNote(id);
  }

}

