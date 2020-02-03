export default class ToggleStats {
  constructor() {
    this.btnPluSign = document.querySelector("#plus-sign");
    this.statsContainer = document.querySelector("#stats-container");
    this.events();
  }
  // EVENTS
  events() {
    this.btnPluSign.addEventListener("click", () => this.toggleStats());
  }

  // METHODS
  toggleStats() {
    if (this.statsContainer.style.display == "none") {
      this.statsContainer.style.display = "block";
    } else {
      this.statsContainer.style.display = "none";
    }
  }
}
