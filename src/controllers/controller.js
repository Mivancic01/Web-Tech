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
  addNotes,
  readNotes,
  updateNotes,
  deleteNotes,
  toggleNote,
  loggedUser,
  userLoggedOut,
  userSingUp,
  userSingIn
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
    this.view.bindDragEvent();
    this.view.bindCloseModal();

    this.handleSignedinUser();
    this.view.bindSignoutUser(this.handleSignoutUser);
    // Display initial notes
    this.onNoteListChanged(this.model.notes);
  }

  handleSignedinUser = () => {
  console.log("loggedUser");
//  console.log(loggedUser);
    loggedUser((res) => {
        if(res.success){
          // User is signed in.
          this.view.bindSignoutUnsuccess();
        }
        else{
            this.handleSignoutUser();
            this.view.bindSignoutSuccess();
        }
    });
//    if (loggedUser) {
//      // User is signed in.
//      this.view.bindSignoutUnsuccess();
//
//    } else {
//      // No user is signed in.
////      fb.auth().signOut()
////      .catch((error) => {
////            // An error happened.
////            var errorCode = error.code;
////            var errorMessage = error.message;
////            console.log("User signed out error");
////            console.log(errorMessage);
////            this.view.bindSignoutError(errorMessage);
////          });
//      this.view.bindSignoutSuccess();
//    }
  }

  handleSignoutUser = () => {
//  var userLoggedout = false;
//    fb.auth().signOut().
    userLoggedOut((res)=>{
        if(res.success){
          this.view.bindSignoutSuccess();
          this.model.readAllNotes();
          this.onNoteListChanged(this.model.notes);
        }
        else{
            this.view.displaySigninError(res.message);
        }
      });
//    then(() => {
//      // Sign-out successful.
//      console.log("User signed out success");
//      this.view.bindSignoutSuccess();
//      this.model.readAllNotes();
//      this.onNoteListChanged(this.model.notes);
//    }).catch((error) => {
//      // An error happened.
//      var errorCode = error.code;
//    var errorMessage = error.message;
//    console.log("User signed out error");
//    console.log(errorMessage);
//    this.view.bindSignoutError(errorMessage);
//    });

  }

  handleSigninSubmit = (email, password) => {
  console.log("signin");
  userSingIn(email, password, (res)=>{
    if(res.success){
        this.view.userSignedin(email);
        readNotes(email, (notesFromDB) => {
            console.log(notesFromDB);
            this.view.displayNotes(notesFromDB);
            this.model.notes = notesFromDB;
        });
    }
    else{
        this.view.displaySigninError(res.message);
    }
  });
//    fb.auth().signInWithEmailAndPassword(email, password)
////    fb.auth().createUserWithEmailAndPassword(email, password)
//    .then((user) => {
//      // Signed in
//      console.log("User signed in");
//      console.log(user);
////      this.handleSignedinUser();
//        this.view.userSignedin(email);
//        readNotes(email, (notesFromDB) => {
//            console.log(notesFromDB);
//            this.view.displayNotes(notesFromDB);
//            this.model.notes = notesFromDB;
//        });
//    })
//    .catch((error) => {
//      var errorCode = error.code;
//      var errorMessage = error.message;
//      console.log("Error");
//      console.log(errorMessage);
//      this.view.displaySigninError(errorMessage);
//    });
  }

  handleSignupSubmit = (name, secondName, email, password) => {
    console.log("signup");

//    addNotes(email, "noteTitle", "noteText", "red" );
    userSingUp(name, secondName, email, password, (res)=>{
        if(res.success){
//          userSingIn(email, password, (res1)=>{
//          if(res1.success){
              this.view.userSignedin(email);
            this.view.displayNotes([]);
            this.model.notes = [];
//          }
//          else{
//              this.view.displaySigninError(res1.message);
//          }
//        });
        }
        else{
              this.view.displaySigninError(res.message);
          }
    });
//    .then((user) => {
      // Signed in
//      addUser(name, secondName, "",email);
//      console.log("User signed in");
//      console.log(user);
//      this.view.userSignedin(email);
//      this.view.displayNotes([]);
//      this.model.notes = [];
//    })
//    .catch((error) => {
//      var errorCode = error.code;
//      var errorMessage = error.message;
//      console.log("Error");
//      console.log(errorMessage);
//      this.view.displaySigninError(errorMessage);
//    });
  }

  onNoteListChanged = (notes) => {
    this.view.displayNotes(notes);
  }

  //handleAddUser = (noteTitle, noteText, noteColor) => {
  //  addUser(noteTitle, noteText, noteColor, "emailEmail")
  //  this.model.addNote(noteTitle, noteText, noteColor);
  //}

  handleAddNote = (noteTitle, noteText, noteColor, image) => {
    //addUser("23", noteText, noteColor, "emailEmail")
    //console.log("inside " + noteTitle + " " + noteText + " " + noteColor)
    //updateUser(noteTitle, noteText, noteColor, "bla")
    //updateFriendByName("noteTitle", "momo", "laaaaaaa", "email@asd")
    //addFriend("noteTitle", "novi", "meme", "email")
//    var user = fb.auth().currentUser;
    const worker = new Worker("../src/worker.js");
    worker.postMessage( noteText);
    loggedUser((res) => {
        if(res.success){
          // User is signed in.
          worker.onmessage = e => {
              var encodedText = e.data;
              const nextNoteId = this.model.notes.length > 0 ? this.model.notes[this.model.notes.length - 1].id + 1 : 1;
              addNotes(nextNoteId, res.user.email, noteTitle, encodedText, noteColor, image);
              readNotes(res.user.email, (notesFromDB) => {
                console.log(notesFromDB);
                this.view.displayNotes(notesFromDB);
                this.model.notes = notesFromDB;
              });
            };
        }
        else{
            worker.onmessage = e => {
              var encodedText = e.data;
              this.model.addNote(noteTitle, encodedText, noteColor, image);
            };
        }
    });
  }

  handleEditNote = (id, todoText) => {
      const worker = new Worker("../src/worker.js");
      worker.postMessage(todoText);
      loggedUser((res) => {
          if(res.success){
              // User is signed in.
              worker.onmessage = e => {
                var encodedText = e.data;
                updateNotes(id, res.user.email, encodedText );
                readNotes(res.user.email, (notesFromDB) => {
                    console.log(notesFromDB);
                    this.view.displayNotes(notesFromDB);
                    this.model.notes = notesFromDB;
                });
              };
          }
          else{
            // No user is signed in.
            worker.onmessage = e => {
              var encodedText = e.data;
              this.model.editNote(id, encodedText);
            };
          }
      });
  }

  handleDeleteNote = (id) => {
    loggedUser((res) => {
      if(res.success){
        // User is signed in.
        deleteNotes(id, res.user.email );
        readNotes(res.user.email, (notesFromDB) => {
            console.log(notesFromDB);
            this.view.displayNotes(notesFromDB);
            this.model.notes = notesFromDB;
        });
      }
      else{
        // No user is signed in.
        this.model.deleteNote(id);
      }
    });
  }

  handleToggleNote = (id) => {
    loggedUser((res) => {
      if(res.success){
        // User is signed in.
        toggleNote(id, res.user.email);
        readNotes(res.user.email, (notesFromDB) => {
            console.log(notesFromDB);
            this.view.displayNotes(notesFromDB);
            this.model.notes = notesFromDB;
        });
      }
      else{
        // No user is signed in.
        this.model.toggleNote(id);
      }
  });
  }

}

