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
    if (
      this.firstName.value != "" &&
      !/^([a-zA-Z0-9]+)$/.test(this.firstName.value)
    ) {
      this.showValidationError(
        this.firstName,
        "First Name can only contain letters and numbers."
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
    // alert("after delay");
  }

  insertValidationElements() {
    this.allFields.forEach(item => {
      item.insertAdjacentHTML(
        "afterend",
        '<div class="bg-red-100 border border-red-400 text-red-700 text-center text-xs rounded liveValidationMessage">ada</div>'
      );
    });
  }

  // END CLASS
}
