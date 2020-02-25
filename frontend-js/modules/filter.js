export default class Filter {
  constructor() {
    this.filterIcon = document.querySelector("#filter-icon");
    this.formContainer = document.querySelector("#form-container");
    this.statsContainer = document.querySelector("#myChart");
    this.filterBtn = document.querySelector("#filter-icon");
    this.arrowDown = document.querySelector("#arrow-down");
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
      this.statsContainer.style.display = "none";
      this.filterBtn.style.color = "#2b6cb0"
      this.arrowDown.style.color = "black";
    } else {
      this.formContainer.style.display = "none";
      this.filterBtn.style.color = "black"
    }
  }
}
