import axios from "axios";
export default class RegistrationFormLiveValidation {
  constructor() {
    this._csrf = document.querySelector('[name="_csrf"').value;
    this.form = document.querySelector("#registration-form");
    this.allFields = document.querySelectorAll(
      "#registration-form .form-control"
    );
    this.insertValidationElements();
    this.firstName = document.querySelector("#first-name");
    this.firstName.previousValue = "";
    this.lastName = document.querySelector("#last-name");
    this.lastName.previousValue = "";
    this.email = document.querySelector("#email");
    this.email.previousValue = ""
    this.email.isUnique = false;
    this.year = document.querySelector("#year");
    this.year.previousValue = ""
    this.password = document.querySelector("#password");
    this.password.previousValue = "";
    this.events();
  }
  //EVENTS
  events() {
    // FORM
      this.form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.formSubmitHandler();
      })
    // KEYUP
    this.firstName.addEventListener("keyup", () => {
      this.isDifferent(this.firstName, this.firstNameHandler);
    });
    this.lastName.addEventListener("keyup", () => {
      this.isDifferent(this.lastName, this.lastNameHandler);
    });

    this.email.addEventListener("keyup", () => {
      this.isDifferent(this.email, this.emailHandler);
    })
    this.year.addEventListener("keyup", () => {
        this.isDifferent(this.year, this.yearHandler());
    })
    this.password.addEventListener("keyup", () => {
      this.isDifferent(this.password, this.passwordHandler);
    })
    // BLUR: DISPLAYS ERROR EVEN IF USER TABS FAST
     this.firstName.addEventListener("blur", () => {
      this.isDifferent(this.firstName, this.firstNameHandler);
    });
     this.lastName.addEventListener("blur", () => {
      this.isDifferent(this.lastName, this.lastNameHandler);
    });
    this.year.addEventListener("blur", () => {
        this.isDifferent(this.year, this.yearHandler());
    })
    this.email.addEventListener("blur", () => {
      this.isDifferent(this.email, this.emailHandler);
    })
    this.password.addEventListener("blur", () => {
      this.isDifferent(this.password, this.passwordHandler);
    })
// END OF EVENTS()
  }

  // GENERAL METHODS
  isDifferent(el, handler) {
    if (el.previousValue != el.value) {
      handler.call(this);
    }
    el.previousValue = el.value;
  }

  hideValidationError(el) {
    el.nextElementSibling.classList.remove("liveValidationMessage--show");
  }

  showValidationError(el, message) {
    el.nextElementSibling.innerText = message;
    el.nextElementSibling.classList.add("liveValidationMessage--show");
    el.errors = true;
  }

  insertValidationElements() {
    this.allFields.forEach(item => {
      item.insertAdjacentHTML(
        "afterend",
        '<div class="bg-red-100 border-red-400 border-l border-t border-r text-red-700 text-center text-xs rounded liveValidationMessage">ada</div>'
      );
    });
  }
// FORM
formSubmitHandler(){
    this.firstNameImmediately();
    this.firstNameAfterDelay();
    this.lastNameImmediately();
    this.lastNameAfterDelay();
    this.emailAfterDelay();
    this.yearImmediately();
    this.yearAfterDelay();
    this.passwordImmediately();
    this.passwordAfterDelay();


    if(
        !this.firstName.errors &&
        !this.lastName.errors &&
        this.email.isUnique && 
        !this.email.errors &&
        !this.year.errors &&
        !this.password.errors
    )
    {
      this.form.submit();
    }

}
// PASSWORD METHODS
passwordHandler() {
    this.password.errors = false;
    this.passwordImmediately();
    clearTimeout(this.password.timer);
    this.password.timer = setTimeout(() => this.passwordAfterDelay(), 1000);
  }

  passwordImmediately(){
      if(this.password.value.length > 50){
        this.showValidationError(this.password, "Password cannot exceed 50 characters.")
      }
      if(!this.password.errors){
        this.hideValidationError(this.password)
      }
  }

  passwordAfterDelay(){
      if(this.password.value.length < 6){
          this.showValidationError(this.password, "Password must be at least 6 characters.")
      }
  }
// EMAIL METHODS
  emailHandler(){
     this.email.errors = false;
     clearTimeout(this.email.timer);
     this.email.timer = setTimeout(() => this.emailAfterDelay(), 1000);
  }

  emailAfterDelay(){
      if(!this.isEmail(this.email.value)){
        this.showValidationError(this.email, "You must provide a valid email address.")
      }
      if(!this.email.errors){
          axios.post('/doesEmailExists', {_csrf: this._csrf, email: this.email.value})
          .then(response =>{
            if(response.data){
                console.log(response.data)
                this.email.isUnique = false;
                this.showValidationError(this.email, "That email is already being used.")
            } else {
                this.email.isUnique = true;
                this.hideValidationError(this.email)
            }
          })
          .catch(() => {
            console.log("Please try again later.")
          })
      }
  }

  isEmail(email) {
 if (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
  {
    return (true)
  }
    return (false)
}

// FIRST NAME METHODS
  firstNameHandler() {
    this.firstName.errors = false;
    this.firstNameImmediately();
    clearTimeout(this.firstName.timer);
    this.firstName.timer = setTimeout(() => this.firstNameAfterDelay(), 1000);
  }

  firstNameImmediately() {
    if (this.firstName.value != "" && !/^[\w-]+$/.test(this.firstName.value)) {
      this.showValidationError(
        this.firstName,
        "First Name can only contain letters, numbers, dashes, and hyphens."
      );
    }
    if (this.firstName.value.length > 50) {
      this.showValidationError(
        this.firstName,
        "First name cannot exceed 50 characters."
      );
    }

    if (!this.firstName.errors) {
      this.hideValidationError(this.firstName);
    }
  }
  

  firstNameAfterDelay() {
    if (this.firstName.value == "") {
      this.showValidationError(
        this.firstName,
        "First name cannot be empty."
      );
    }
  }
// LAST NAME METHODS
lastNameHandler(){
    this.lastName.errors = false;
    this.lastNameImmediately();
    clearTimeout(this.lastName.timer);
    this.lastName.timer = setTimeout(() => this.lastNameAfterDelay(), 1000);
}

lastNameImmediately(){
    if(this.lastName.value != "" && !/^[\w-]+$/.test(this.lastName.value)){
        this.showValidationError(this.lastName, "Last name can only contain letters, numbers, dashes, and hyphens.");
    }
    if(this.lastName.value.length > 50){
        this.showValidationError(this.lastName, "Last name cannot exceed 50 characters.");
    }
    if(!this.lastName.errors){
        this.hideValidationError(this.lastName);
    }
}

lastNameAfterDelay(){
    if(this.lastName.value == ""){
        this.showValidationError(this.lastName, "Last name cannot be empty.")
    }
}
// YEAR METHODS
yearHandler(){
    this.year.errors = false;
    this.yearImmediately();
    clearTimeout(this.year.timer);
    this.year.timer = setTimeout(() => this.yearAfterDelay(), 1000);
}

yearImmediately(){
    if(this.year.value != "" && !/^[\d]+$/.test(this.year.value)){
        this.showValidationError(this.year, "Year can only be numbers.");
    }
    if(this.year.value.length > 4){
        this.showValidationError(this.year, "Year cannot exceed 4 characters.")
    }
    if(!this.year.errors){
        this.hideValidationError(this.year)
    }
}

yearAfterDelay(){
    if(this.year.value.length < 4){
        this.showValidationError(this.year, "Year cannot be less than 4 characters.")
    }
}

  // END CLASS
}
