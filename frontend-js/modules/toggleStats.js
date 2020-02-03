export default class ToggleStats {
  constructor() {
    this.btnPluSign = document.querySelector("#plus-sign");
    this.statsContainer = document.querySelector("#stats-container");
    this.body = document.querySelector("body");
    this.toolTip = document.querySelector("#tool-tip");
    this.events();
  }
  // EVENTS
  events() {
    this.btnPluSign.addEventListener("click", e => this.toggleStats(e));
    this.body.addEventListener("click", () => this.closeStatsModel());
    this.btnPluSign.addEventListener("mouseover", e => this.showToolTip(e));
    this.body.addEventListener("mouseover", () => this.closeToolTip());
  }

  // METHODS
  toggleStats(e) {
    e.stopPropagation();
    if (this.statsContainer.style.display == "none") {
      this.statsContainer.style.display = "block";
    } else {
      this.statsContainer.style.display = "none";
    }
  }

  closeStatsModel() {
    this.statsContainer.style.display = "none";
  }

  showToolTip(e) {
    e.stopPropagation();
    this.toolTip.style.display = "block";
  }
  closeToolTip() {
    this.toolTip.style.display = "none";
  }
  // END CLASS
}
