export default class ToggleStats {
  constructor() {
    this.arrowDown = document.querySelector("#arrow-down");
    this.statsContainer = document.querySelector("#myChart");
    this.arrowSigns = document.querySelector("#arrows");
     this.formContainer = document.querySelector("#form-container");
    this.events();
  }
  // EVENTS
  events() {
    this.arrowDown.addEventListener("click", () => this.toggleStats());
  }

  // METHODS
  toggleStats() {
    if (this.statsContainer.style.display == "none") {
      this.statsContainer.style.display = "block";
      this.formContainer.style.display = "none";
    } else {
      this.statsContainer.style.display = "none";
    }
  }
  // END CLASS
}
