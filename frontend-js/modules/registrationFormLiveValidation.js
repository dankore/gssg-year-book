import axios from "axios";
export default class RegistrationFormLiveValidation {
  constructor() {
    this.allFields = document.querySelectorAll(
      "#registration-form .form-control"
    );
    this.insertValidationElements();
    this.firstName = document.querySelector("#first-name");
    this.firstName.previousValue = "";
    this.email = document.querySelector("#email");
    this.email.previousValue = ""
    this.email.isUnique = false;
    this.password = document.querySelector("#password");
    this.password.previousValue = "";
    this.events();
  }
  //EVENTS
  events() {
    this.firstName.addEventListener("keyup", () => {
      this.isDifferent(this.firstName, this.firstNameHandler);
    });
    this.email.addEventListener("keyup", () => {
      this.isDifferent(this.email, this.emailHandler);
    })
    this.password.addEventListener("keyup", () => {
      this.isDifferent(this.password, this.passwordHandler);
    })

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

// PASSWORD METHODS
passwordHandler() {
    this.password.errors = false;
    this.passwordImmediately();
    clearTimeout(this.password.timer);
    this.password.timer = setTimeout(() => this.passwordAfterDelay(), 800);
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
     this.email.timer = setTimeout(() => this.emailAfterDelay(), 800);
  }

  emailAfterDelay(){
      if(!/^\S+@\S+$/.test(this.email.value)){
        this.showValidationError(this.email, "You must provide a valid email address.")
      }
      if(!this.email.errors){
          axios.post('/doesEmailExists', {email: this.email.value})
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
          .catch(()=>{
            console.log("Please try again later.")
          })
      }
  }
// FIRST NAME METHODS
  firstNameHandler() {
    this.firstName.errors = false;
    this.firstNameImmediately();
    clearTimeout(this.firstName.timer);
    this.firstName.timer = setTimeout(() => this.firstNameAfterDelay(), 800);
  }

  firstNameImmediately() {
    if (this.firstName.value != "" && !/^[\w-]+$/.test(this.firstName.value)) {
      this.showValidationError(
        this.firstName,
        "First Name can only contain letters and numbers."
      );
    }
    if (this.firstName.value.length > 30) {
      this.showValidationError(
        this.firstName,
        "First name cannot exceed 30 characters."
      );
    }

    if (!this.firstName.errors) {
      this.hideValidationError(this.firstName);
    }
  }
  

  firstNameAfterDelay() {
    if (this.firstName.value.length == "") {
      this.showValidationError(
        this.firstName,
        "First name cannot be empty."
      );
    }
  }

  insertValidationElements() {
    this.allFields.forEach(item => {
      item.insertAdjacentHTML(
        "afterend",
        '<div class="bg-red-100 border-red-400 border-l border-t border-r text-red-700 text-center text-xs rounded liveValidationMessage">ada</div>'
      );
    });
  }

  // END CLASS
}
