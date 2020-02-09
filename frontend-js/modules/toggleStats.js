export default class ToggleStats {
  constructor() {
    this.arrowDown = document.querySelector("#arrow-down");
    this.statsContainer = document.querySelector("#myChart");
    this.arrowSigns = document.querySelector("#arrows");
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
      this.arrowSigns.innerHTML = "&#8911";
    } else {
      this.statsContainer.style.display = "none";
       this.arrowSigns.innerHTML = "&#8910";
    }
  }
  // END CLASS
}
