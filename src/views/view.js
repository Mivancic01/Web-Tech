/**
 * @class View
 *
 * Visual representation of the model.
 */

export class View {
    constructor() {
      this.app = this.getElement('#root');
      //Sign/signup form
      this.notesHeader = this.getElement("#notes-header");
      this.spanUserSignout = this.createElement('span', 'user-signout');
      this.spanUserEmail = this.createElement('span', 'user-details');

      this.spanUserSignout.textContent = "Sign out";
//      this.spanUserSignout.style.display = "none";
//      this.spanUserEmail.style.display = "none";

      this.notesHeader.append(this.spanUserEmail, this.spanUserSignout);

      this.signin = this.getElement("#sign-in");
      this.signup = this.getElement("#sign-up");

      this.signupForm = this.createElement('form', 'sign-up-form');
      this.signinForm = this.createElement('form', 'sign-in-form');
      this.signindiv = this.createElement('div', 'container');

      this.signupTitle = this.createElement('h2');
      this.signupTitle.textContent = 'Sign up';

      this.signinTitle = this.createElement('h2');
      this.signinTitle.textContent = 'Sign in';

      this.signupName = this.createElement('input');
      this.signupName.type = 'text';
      this.signupName.placeholder = 'Enter first name';
      this.signupName.name = 'user_firstname';
      this.signupName.required = 'required';

      this.signupSecondName = this.createElement('input');
      this.signupSecondName.type = 'text';
      this.signupSecondName.placeholder = 'Enter second name';
      this.signupSecondName.name = 'user_secondname';

      this.signinEmail = this.createElement('input');
      this.signinEmail.type = 'email';
      this.signinEmail.placeholder = 'Enter E-mail';
      this.signinEmail.name = 'user_email';
      this.signinEmail.required = 'required';

      this.signinPassword = this.createElement('input');
      this.signinPassword.type = 'password';
      this.signinPassword.placeholder = 'Enter password';
      this.signinPassword.name = 'user_password';
      this.signinPassword.required = 'required';

      this.signinSubmit = this.createElement('button', 'signin-submit');
      this.signinSubmit.textContent = 'Submit';

      this.signupSubmit = this.createElement('button', 'signup-submit');
      this.signupSubmit.textContent = 'Submit';

      this.signErrorMessage = this.createElement('span', 'signin-error-message');
      this.submitSignin = this.getElement(".signin-submit");
      //End of sign/signup form
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

      this.noteList.addEventListener('dragover',this.drag_over,false);
      this.noteList.addEventListener('drop',this.drop,false);

      //DRAG SHIT
      this.currentX = 0;
      this.currentY = 0;
      this.initialX = 0;
      this.initialY = 0;
      this.xOffset = 0;
      this.yOffset = 0;
      this.active = false;

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
          console.log("a note id is: " + li.id);

          //Start Drag
          li.draggable = true

          //End Drag

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
          li.style.height = 250;
//          li.append(checkbox, spanTitle, span, deleteButton);

          // Append nodes
          li.append(innerdiv);
          this.noteList.append(li);
        })
      }

      // Debugging
      console.log(notes)
    }

    bindDragEvent() {
      console.log("ENTERED BIND_DRAG_EVENT()");
      this.noteList.addEventListener('mousedown', event => {
            console.log("ENTERED mousedown");
            this.initialX = event.clientX - this.xOffset;
            this.initialY = event.clientY - this.yOffset;

            //if (this.checkTargetValidity(event.target)) {
              this.active = true;
             // }
          })
        this.noteList.addEventListener('mouseup', event => {
            if(this.active){
              event.preventDefault();
              console.log("ENTERED mouseup");
              this.currentX = event.clientX - this.initialX;
              this.currentY = event.clientY - this.initialY;

              this.xOffset = this.currentX;
              this.yOffset = this.currentY;

              event.target.style.transform = "translate3d(" + this.currentX + "px, " + this.currentY + "px, 0)";
            }
          })
        this.noteList.addEventListener('mousemove', event => {
            this.initialX = this.currentX;
            this.initialY = this.currentY;

            this.active = false;
            console.log("ENTERED mousemove");
          })
    }

    checkTargetValidity(eventTarget){
         // console.log("the target id is: " + eventTarget);
      for (var i = 0; i < this.noteList.length; i++) {
        if(this.noteList[i] === eventTarget){
          console.log("found our target!");
          return true;
          }
        }
      return false;
    }

    _initLocalListeners() {
      this.noteList.addEventListener('input', event => {
        if (event.target.className === 'editable') {
          this._temporaryNoteText = event.target.innerText
        }
      })
    }

    bindAddNote(handler) {
//      console.log(document.getElementsByClassName("note-list"));
//      console.log(document.getElementsByClassName("note-list").childNodes);
//      console.log(document.getElementsByClassName("note-list")[0].lastChild);
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

    bindSigninForm() {
        this.signin.addEventListener('click', event => {
            this.signindiv.append(this.signinTitle, this.signinEmail, this.signinPassword, this.signinSubmit, this.signErrorMessage);
            this.signinForm.append(this.signindiv);
            this.app.append(this.signinForm);
        })
    }

    bindSigninSubmit(handler) {
        this.signinForm.addEventListener('submit', event => {
            event.preventDefault();
            this.signErrorMessage.textContent = "";
            handler(this.signinEmail.value, this.signinPassword.value);
            this.signinEmail.value = '';
            this.signinPassword.value = '';
        })
    }

    userSignedin(email){
//        this.signin.remove();
//        this.signup.remove();
        this.spanUserEmail.textContent = email;
        this.spanUserSignout.textContent = "Sign out";

        this.signin.style.display = "none";
        this.signup.style.display = "none";

        this.spanUserSignout.style.display = null;
        this.spanUserEmail.style.display = null;

    }

    displaySigninError(message){
        this.signErrorMessage.textContent = message;
    }

    bindSignupForm() {
        this.signup.addEventListener('click', event => {
            this.signindiv.append(this.signupTitle, this.signupName, this.signupSecondName, this.signinEmail, this.signinPassword,
             this.signupSubmit, this.signErrorMessage);
            this.signupForm.append(this.signindiv);
            this.app.append(this.signupForm);
        })
    }

    bindSignupSubmit(handler) {
        this.signupForm.addEventListener('submit', event => {
            event.preventDefault();
            this.signErrorMessage.textContent = "";
            handler(this.signupName.value, this.signupSecondName.value, this.signinEmail.value, this.signinPassword.value);
            this.signupName.value = '';
            this.signupSecondName.value = '';
            this.signinEmail.value = '';
            this.signinPassword.value = '';
        })
    }

    bindSignoutUser(handler) {
        this.spanUserSignout.addEventListener('click', event => {
            //Do something only on successful signout!.
            handler();
        })
    }

    bindSignoutUnsuccess() {
        this.spanUserSignout.style.display = null;
        this.spanUserEmail.style.display = null;

        this.signin.style.display = "none";
        this.signup.style.display = "none";
    }

    bindSignoutSuccess() {
        this.spanUserSignout.style.display = "none";
        this.spanUserEmail.style.display = "none";

        this.signin.style.display = null;
        this.signup.style.display = null;
    }

    bindSignoutError(errorMessage) {
        alert(errorMessage);
    }

    HandleDragEvent(ev){
        this._commit(this.notes);
    }

  }
