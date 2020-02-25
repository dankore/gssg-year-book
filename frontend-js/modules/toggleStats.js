export default class ToggleStats {
  constructor() {
    this.arrowDown = document.querySelector("#arrow-down");
    this.statsContainer = document.querySelector("#myChart");
    this.arrowSigns = document.querySelector("#arrows");
    this.formContainer = document.querySelector("#form-container");
    this.filterBtn = document.querySelector("#filter-icon");
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
      this.filterBtn.style.color = "black";
      this.arrowDown.style.color = "#2b6cb0";
    } else {
      this.statsContainer.style.display = "none";
      this.arrowDown.style.color = "black";
    }
  }
  // END CLASS
}
