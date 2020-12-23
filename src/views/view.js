/**
 * @class View
 *
 * Visual representation of the model.
 */

export class View {
    constructor() {
      this.app = this.getElement('#root');
      // new code
      this.rowdiv = this.createElement('div', 'row');
      this.colform = this.createElement('div', 'col-lg-3');
      this.colnote = this.createElement('div', 'col-lg-9');
      this.noteList = this.createElement('div', 'note-list');
      this.colnote.append(this.noteList);
      this.app.append(this.rowdiv);
      this.rowdiv.append(this.colform, this.colnote);
      // end of new code
      this.div = this.createElement('div');
      this.div.className = "new-note";

      this.form = this.createElement('form');

      this.inputTitle = this.createElement('input');
      this.inputTitle.type = 'text';
      this.inputTitle.placeholder = 'Add title';
      this.inputTitle.name = 'title';

      this.inputText = this.createElement('input');
      this.inputText.type = 'text';
      this.inputText.placeholder = 'Add text';
      this.inputText.name = 'text';

      this.inputColor = this.createElement('input');
      this.inputColor.type = 'text';
      this.inputColor.placeholder = 'Add color';
      this.inputColor.name = 'color';

      this.submitButton = this.createElement('button');
      this.submitButton.textContent = 'Submit';
      this.form.append(this.inputTitle, this.inputText, this.inputColor, this.submitButton);
      this.div.append(this.form);

      this.title = this.createElement('h4');
      this.title.textContent = 'Add notes';
//      this.noteList = this.createElement('ul', 'note-list');
//      this.app.append(this.noteList);
      this.colform.append(this.title, this.div);

      this._temporaryNoteText = '';
      this._initLocalListeners();
    }

    get _noteTitle() {
      return this.inputTitle.value;
    }

    get _noteText() {
      return this.inputText.value;
    }

    get _noteColor() {
      return this.inputColor.value;
    }

    _resetInput() {
      this.inputTitle.value = '';
      this.inputText.value = '';
      this.inputColor.value = '';
    }

    createElement(tag, className) {
      const element = document.createElement(tag);

      if (className) {
        element.classList.add(className);
      }

      return element;
    }

    getElement(selector) {
      const element = document.querySelector(selector);

      return element;
    }

    displayNotes(notes) {
      // Delete all nodes
      while (this.noteList.firstChild) {
        this.noteList.removeChild(this.noteList.firstChild);
      }

      // Show default message
      if (notes.length === 0) {
        const p = this.createElement('p');
        p.textContent = 'There are no notes! Add a note?';
        this.noteList.append(p);
      } else {
        // Create nodes
        notes.forEach((note) => {
          const li = this.createElement('div', 'col-lg-3');
          const innerdiv = this.createElement('div', 'indv-note');
//          const li = this.createElement('li');
          li.id = note.id;

          const checkbox = this.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.checked = note.complete;

          const spanTitle = this.createElement('span');
          spanTitle.contentEditable = false;
          spanTitle.textContent = note.title;

          const span = this.createElement('span');
          span.contentEditable = true;
          span.classList.add('editable');

          if (note.complete) {
            const strike = this.createElement('s');
            strike.textContent = note.text;
            span.append(strike);
          } else {
            span.textContent = note.text;
          }

          const deleteButton = this.createElement('button', 'delete');
          deleteButton.classList.add('btn');
          deleteButton.classList.add('btn-default');
          deleteButton.textContent = 'Delete';

          innerdiv.style.backgroundColor = note.color;
          innerdiv.style.height = '200px';
          innerdiv.append(checkbox, spanTitle, span, deleteButton);
//          li.style.backgroundColor = note.color;
//          li.append(checkbox, spanTitle, span, deleteButton);

          // Append nodes
          li.append(innerdiv);
          this.noteList.append(li);
        })
      }

      // Debugging
      console.log(notes)
    }

    _initLocalListeners() {
      this.noteList.addEventListener('input', event => {
        if (event.target.className === 'editable') {
          this._temporaryNoteText = event.target.innerText
        }
      })
    }

    bindAddNote(handler) {
      this.form.addEventListener('submit', event => {
        event.preventDefault()
        if (this._noteTitle || this._noteText || this._noteColor) {
          handler(this._noteTitle, this._noteText, this._noteColor)
          this._resetInput()
        }
      })
    }

    bindDeleteNote(handler) {
      this.noteList.addEventListener('click', event => {
        if (event.target.classList.contains('delete')) {
          const id = parseInt(event.target.parentElement.parentElement.id)
//          const id = parseInt(event.target.parentElement.id)

          handler(id)
        }
      })
    }

    bindEditNote(handler) {
      this.noteList.addEventListener('focusout', event => {
        if (this._temporaryNoteText) {
          const id = parseInt(event.target.parentElement.parentElement.id)
//          const id = parseInt(event.target.parentElement.id)

          handler(id, this._temporaryNoteText)
          this._temporaryNoteText = ''
        }
      })
    }

    bindToggleNote(handler) {
      this.noteList.addEventListener('change', event => {
        if (event.target.type === 'checkbox') {
          const id = parseInt(event.target.parentElement.parentElement.id)
//          const id = parseInt(event.target.parentElement.id)

          handler(id)
        }
      })
    }
  }
