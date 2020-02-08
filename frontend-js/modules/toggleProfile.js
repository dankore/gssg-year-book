export default class ToggleProfile {
  constructor() {
    this.showMoreProfileBtn = document.querySelector("#more-profile-btn");
    this.moreProfileContainer = document.querySelector(
      "#more-profile-container"
    );
    this.events();
  }

  // EVENTS
  events() {
    this.showMoreProfileBtn.addEventListener("click", () =>
      this.showMoreProfileHandler()
    );
  }

  // METHODS
  showMoreProfileHandler() {
    if (this.moreProfileContainer.style.display == "none") {
      this.moreProfileContainer.style.display = "block";
      this.showMoreProfileBtn.innerHTML = "Show less &#8593";
    } else {
      this.showMoreProfileBtn.innerHTML = "Show more &#8595";
      this.moreProfileContainer.style.display = "none";
    }
  }

  // END CLASS
}
