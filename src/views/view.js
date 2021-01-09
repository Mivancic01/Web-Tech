/**
 * @class View
 *
 * Visual representation of the model.
 */
import { whiteboardListener, clearCanvas } from '../helpers/whiteboard.helper';
import { adaptColor } from '../helpers/adapt-color.helper';

export class View {
    canvasID = 'canvase';

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

      const divColor = this.createElement('div', 'color-input-container');

      const colorInstructions = this.createElement('span');
      colorInstructions.contentEditable = false;
      colorInstructions.textContent = 'Pick the color of your note: ';
      
      this.inputColor = this.createElement('input');
      this.inputColor.type = 'color';
      this.inputColor.placeholder = 'Add color';
      this.inputColor.name = 'color';
      this.inputColor.value = '#ffffff'

      divColor.append(colorInstructions, this.inputColor);

      this.submitButton = this.createElement('button');
      this.submitButton.textContent = 'Submit';
      const whiteboard = this.displayWhiteBoard();

      this.form.append(this.inputTitle, this.inputText, whiteboard, divColor, this.submitButton);
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
      this.dragTarget = null;
      this.mousePosX = 0;
      this.mousePoxY = 0;
      this.positionDict = {};

      //END OF DRAG SHIT

      this._temporaryNoteText = '';
      whiteboardListener(this.canvasID);
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
      this.inputColor.value = '#ffffff';

      clearCanvas(this.canvasID);
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

//      console.log("FUCKING DISPLAY!");

      // Show default message
      if (notes.length === 0) {
        const p = this.createElement('p');
        p.textContent = 'There are no notes! Add a note?';
        this.noteList.append(p);
      } else {
        // Create nodes
        let noteIDs = [];
        notes.forEach((note) => {
          const li = this.createElement('div', 'col-lg-3');
          const innerdiv = this.createElement('div', 'indv-note');
          const noteID = `note-${note.id}`;
          innerdiv.setAttribute('id', noteID);
          noteIDs.push(noteID);

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

          //Edit position dict
          if(!(note.id in this.positionDict)){
            this.positionDict[note.id] = [0, 0];
          }
          else {
            li.style.transform = "translate3d(" + this.positionDict[note.id][0] + "px, " + this.positionDict[note.id][1] + "px, 0)";
          }

          if (note.complete) {
            const strike = this.createElement('s');
            strike.textContent = atob(note.text);
            span.append(strike);
          } else {
            span.textContent = atob(note.text);
          }

          const deleteButton = this.createElement('button', 'delete');
          deleteButton.classList.add('btn');
          deleteButton.classList.add('btn-default');
          deleteButton.textContent = 'Delete';
          deleteButton.style.position = 'absolute';
          deleteButton.style.top = 0;
          deleteButton.style.right = 0;

          const image = this.createElement('img', 'note-image');
          image.setAttribute('src', note.image);

          innerdiv.style.backgroundColor = note.color;
          innerdiv.style.height = '200px';
          innerdiv.style.position = 'relative';
          innerdiv.append(checkbox, spanTitle, span, deleteButton);
          li.style.height = 250;

          if (note.image) {
            innerdiv.append(image);
          }

          // Append nodes
          li.append(innerdiv);
          this.noteList.append(li);
        });
        noteIDs.forEach((noteID) => adaptColor(noteID));
      }
    }

    displayWhiteBoard() {
      const divWhole = this.createElement('div');
      divWhole.setAttribute('id', 'whole');
      const divInstructions = this.createElement('div');
      divInstructions.setAttribute('id', 'instructions');
      const divBoard = this.createElement('div');
      divBoard.setAttribute('id', 'board');
      const canvas = this.createElement('canvas');
      canvas.setAttribute('id', this.canvasID);
      const spanInstructions = this.createElement('span');
      spanInstructions.contentEditable = false;
      spanInstructions.textContent = 'Draw something in your note by tapping or dragging in the box'; 

      divBoard.append(canvas);
      divInstructions.append(spanInstructions);
      divWhole.append(divInstructions, divBoard);

      return divWhole;
    }

    bindDragEvent() {
      //console.log("ENTERED BIND_DRAG_EVENT()");
      this.noteList.addEventListener('mousedown', event => {
            /*console.log("ENTERED mousedown");
            console.log("EVENT TARGET ATTR ID: " + event.target);
            this.xOffset = 0;
            this.yOffset = 0;
            this.initialX = event.clientX - this.xOffset;
            this.initialY = event.clientY - this.yOffset;*/

           // if (this.checkTargetValidity(event.target)) {
           //   this.active = true;
           //    }

            if(this.checkTargetValidity(event.target) == true){
              //console.log("SETTING DRAG TARGET");
              this.active = true;

              var style = window.getComputedStyle(this.dragTarget);
              var matrix = new WebKitCSSMatrix(style.transform);
              this.xOffset = matrix.m41;
              this.yOffset = matrix.m42;

              this.initialX = event.clientX - this.xOffset;
              this.initialY = event.clientY - this.yOffset;



            }
          })
        this.noteList.addEventListener('drop', event => {
            if(this.active){
              event.preventDefault();
              this.currentX = event.clientX - this.initialX;
              this.currentY = event.clientY - this.initialY;

              this.xOffset = this.currentX;
              this.yOffset = this.currentY;

              //console.log("Final translate3d pos: " + this.xOffset + ", " + this.yOffset);
              this.dragTarget.style.transform = "translate3d(" + this.currentX + "px, " + this.currentY + "px, 0)";
              //("Drag Target ID is: " + this.dragTarget.id);
              this.positionDict[this.dragTarget.id] = [this.currentX, this.currentY];
              this.dragTarget = null;
              this.active = false;
            }
          })
        this.noteList.addEventListener('drag', event => {
            if(this.dragTarget != null){
              //console.log("DRAG: X is: " + event.clientX + ", and Y is: " + event.clientY);
              this.currentX = event.clientX - this.initialX;
              this.currentY = event.clientY - this.initialY;

              this.xOffset = this.currentX;
              this.yOffset = this.currentY;

              this.dragTarget.style.transform = "translate3d(" + this.currentX + "px, " + this.currentY + "px, 0)";
            }
          })
        this.noteList.addEventListener('dragenter', event => {
            event.preventDefault();
          })
        this.noteList.addEventListener('dragover', event => {
            event.preventDefault();
          })
    }

    checkTargetValidity(eventTarget){
          //("the target id is: " + eventTarget.getAttribute('id'));

      var children = this.noteList.children;
      for (var i = 0; i < children.length; i++) {
          //console.log("Looking!");
         // console.log(children[i].id);
        if(children[i].firstChild === eventTarget){
          //console.log("found our target!");
          this.dragTarget = children[i];
          return true;
          }
        }
      this.dragTarget = null;
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
          const canvas = document.getElementById(this.canvasID);
          const img = canvas.toDataURL('image/png');
          console.log(img);
          handler(this._noteTitle, this._noteText, this._noteColor, img);

          this._resetInput();
        }
      })
    }

    adjustNotesWidth(id){
    //GET WIDTH
      var element = document.getElementById(id);
      var positionInfo = element.getBoundingClientRect();
      var height = positionInfo.height;
      var width = positionInfo.width;
      //console.log("BOX: " + height + ", " + width);

      //ADJUST THE WIDTH OF EVERY OTHER NOTE MADE AFTER THE DELETED ONE
      var children = this.noteList.children;
      for (var i = 0; i < children.length; i++) {
        if(children[i].className === "col-lg-3"){
          //console.log("Note!");
          if(children[i].id > id){
            if(this.positionDict[children[i].id][0] != 0 && this.positionDict[children[i].id][1] != 0){
              //console.log("ADJUSTING!");
              this.positionDict[children[i].id][0] += width;
              //console.log("End Adjusting!");
            }
            }
          }
        }
    }

    bindDeleteNote(handler) {
      this.noteList.addEventListener('click', event => {
        if (event.target.classList.contains('delete')) {
          const id = parseInt(event.target.parentElement.parentElement.id)
//          const id = parseInt(event.target.parentElement.id)
          if((id in this.positionDict)){
            delete this.positionDict[id];

            this.adjustNotesWidth(id);
          }

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
