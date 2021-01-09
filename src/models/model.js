/**
 * @class Model
 *
 * Manages the data of the application.
 */
export class Model {
  constructor() {
    this.notes = JSON.parse(localStorage.getItem('notes')) || [];
  }

  bindNoteListChanged(callback) {
    this.onNoteListChanged = callback
  }

  readAllNotes() {
    this.notes = JSON.parse(localStorage.getItem('notes')) || [];
  }

  _commit(notes) {
    this.onNoteListChanged(notes);
    localStorage.setItem('notes', JSON.stringify(notes));
  }

  addNote(noteTitle, noteText, noteColor, image) {
    const note = {
      id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1,
      title: noteTitle,
      text: noteText,
      color: noteColor,
      image: image,
      complete: false,
    };


    this.notes.push(note);

    this._commit(this.notes);
  }

  editNote(id, updatedText) {
    this.notes = this.notes.map(note =>
      note.id === id ? { ...note, text: updatedText } : note
    )

    this._commit(this.notes);
  }

  deleteNote(id) {
    this.notes = this.notes.filter(note => note.id !== id);

    this._commit(this.notes);
  }

  toggleNote(id) {
    this.notes = this.notes.map(note =>
      note.id === id ? { ...note, complete: !note.complete } : note
    );

    this._commit(this.notes);
  }
}