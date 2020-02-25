export default class ToggleStats {
  constructor() {
    this.barChatIconContainer = document.querySelector(
      "#bar-chart-icon-container"
    );
    this.statsContainer = document.querySelector("#myChart");
    this.filterIconContainer = document.querySelector("#filter-icon-container");
    this.formContainer = document.querySelector("#form-container");
    this.events();
  }
  // EVENTS
  events() {
    this.barChatIconContainer.addEventListener("click", () =>
      this.toggleStats()
    );
  }

  // METHODS
  toggleStats() {
    if (this.statsContainer.style.display == "none") {
      this.statsContainer.style.display = "block";
      this.formContainer.style.display = "none";
      this.barChatIconContainer.classList.add("top-bar");
      this.filterIconContainer.classList.remove("top-bar");
    } else {
      this.statsContainer.style.display = "none";
      this.barChatIconContainer.classList.remove("top-bar");
    }
  }
  // END CLASS
}
