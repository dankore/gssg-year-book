export default class Filter {
  constructor() {
    this.filterIcon = document.querySelector("#filter-icon");
    this.formContainer = document.querySelector("#form-container");
    this.events();
  }
  // EVENTS
  events() {
    this.filterIcon.addEventListener("click", () => this.handleFilterIcon());
  }

  // METHODS
  handleFilterIcon() {
    if (this.formContainer.style.display == "none") {
      this.formContainer.style.display = "block";
    } else {
      this.formContainer.style.display = "none";
    }
  }
}
