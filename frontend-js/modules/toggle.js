export default class Toggle {
  constructor() {
    this.optionalFields = document.querySelector("#optional-fields");
    this.btnOptionalFields = document.querySelector("#btn-optional-fields");
    this.moreOptionalFields = document.querySelector("#more-optional-fields");
    this.btnMoreOptionalFields = document.querySelector(
      "#btn-more-optional-fields"
    );
    this.events();
  }
  // EVENTS
  events() {
    this.btnOptionalFields.addEventListener("click", () =>
      this.toggleOptionalFields()
    );
    this.btnMoreOptionalFields.addEventListener("click", () =>
      this.toggleMoreOptionalFields()
    );
  }
  // METHODS
  toggleOptionalFields() {
    if (this.optionalFields.style.display == "block") {
      this.optionalFields.style.display = "none";
      this.btnOptionalFields.innerHTML = "Show &#8595";
    } else {
      this.optionalFields.style.display = "block";
      this.btnOptionalFields.innerHTML = "Hide &#8593";
    }
  }
  toggleMoreOptionalFields() {
    if (this.moreOptionalFields.style.display == "block") {
      this.moreOptionalFields.style.display = "none";
      this.btnMoreOptionalFields.innerHTML = "Show &#8595";
    } else {
      this.moreOptionalFields.style.display = "block";
      this.btnMoreOptionalFields.innerHTML = "Hide &#8593";
    }
  }
}
