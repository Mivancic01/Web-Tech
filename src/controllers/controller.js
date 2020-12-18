/**
 * @class Controller
 *
 * Links the user input and the view output.
 *
 * @param model
 * @param view
 */

import {
  addUser
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


    // Display initial notes
    this.onNoteListChanged(this.model.notes);
  }

  onNoteListChanged = (notes) => {
    this.view.displayNotes(notes);
  }

  //handleAddUser = (noteTitle, noteText, noteColor) => {
  //  addUser(noteTitle, noteText, noteColor, "emailEmail")
  //  this.model.addNote(noteTitle, noteText, noteColor);
  //}

  handleAddNote = (noteTitle, noteText, noteColor) => {
    //addUser(noteTitle, noteText, noteColor, "emailEmail")
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

