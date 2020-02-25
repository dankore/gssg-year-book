export default class Filter {
  constructor() {
    this.filterIconContainer = document.querySelector("#filter-icon-container");
    this.formContainer = document.querySelector("#form-container");
    this.statsContainer = document.querySelector("#myChart");
    this.barChatIconContainer = document.querySelector(
      "#bar-chart-icon-container"
    );
    this.events();
  }
  // EVENTS
  events() {
    this.filterIconContainer.addEventListener("click", () =>
      this.handleFilterIcon()
    );
  }

  // METHODS
  handleFilterIcon() {
    if (this.formContainer.style.display == "none") {
      this.formContainer.style.display = "block";
      this.statsContainer.style.display = "none";
      this.filterIconContainer.classList.add("top-bar");
      this.barChatIconContainer.classList.remove("top-bar");
    } else {
      this.filterIconContainer.classList.remove("top-bar");
      this.formContainer.style.display = "none";
    }
  }
}
