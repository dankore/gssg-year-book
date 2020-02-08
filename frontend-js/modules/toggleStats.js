export default class ToggleStats {
  constructor() {
    this.arrowDown = document.querySelector("#arrow-down");
    this.statsContainer = document.querySelector("#myChart");
    this.events();
  }
  // EVENTS
  events() {
    this.arrowDown.addEventListener("click", () => this.toggleStats());
  }

  // METHODS
  toggleStats() {
    console.log("hi")
    if (this.statsContainer.style.display == "none") {
      this.statsContainer.style.display = "block";
    } else {
      this.statsContainer.style.display = "none";
    }
  }
  // END CLASS
}
