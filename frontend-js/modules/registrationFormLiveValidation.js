export default class RegistrationFormLiveValidation {
  constructor() {
    this.allFields = document.querySelectorAll(
      "#registration-form .form-control"
    );
    this.insertValidationElements();
    this.firstName = document.querySelector("#first-name");
    this.firstName.previousValue = "";
    this.events();
  }
  //EVENTS
  events() {
    this.firstName.addEventListener("keyup", () => {
      this.isDifferent(this.firstName, this.firstNameHandler);
    });
  }

  // METHODS
  isDifferent(el, handler) {
    if (el.previousValue != el.value) {
      handler.call(this);
    }
    el.previousValue = el.value;
  }

  firstNameHandler() {
    this.firstName.errors = false;
    this.firstNameImmediately();
    clearTimeout(this.firstName.timer);
    this.firstName.timer = setTimeout(() => this.firstNameAfterDelay(), 3000);
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
  hideValidationError(el) {
    el.nextElementSibling.classList.remove("liveValidationMessage--show");
  }
  showValidationError(el, message) {
    el.nextElementSibling.innerText = message;
    el.nextElementSibling.classList.add("liveValidationMessage--show");
    el.errors = true;
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
        '<div class="bg-red-100 border-red-400 border-l border-t border-r text-red-700 text-center text-xs z-10 rounded liveValidationMessage">ada</div>'
      );
    });
  }

  // END CLASS
}
