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
  fb
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

    // Display initial notes
    this.onNoteListChanged(this.model.notes);
  }

  handleSigninSubmit = (email, password) => {
  console.log("signin");
    fb.auth().signInWithEmailAndPassword(email, password)
//    fb.auth().createUserWithEmailAndPassword(email, password)
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

  handleSignupSubmit = (name, secondName, email, password) => {
    console.log("signup");
    addUser(name, secondName, "",email);
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
    this.model.addNote(noteTitle, noteText, noteColor);
  }

  handleEditNote = (id, todoText) => {
    this.model.editNote(id, todoText);
  }

  handleDeleteNote = (id) => {
    this.model.deleteNote(id);
  }

  handleToggleNote = (id) => {
    this.model.toggleNote(id);
  }

}

