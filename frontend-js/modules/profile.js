export default class Profile {
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
      this.showMoreProfileBtn.innerHTML = "Show less";
    } else {
      this.showMoreProfileBtn.innerHTML = "Show full profile";
      this.moreProfileContainer.style.display = "none";
    }
  }

  // END CLASS
}
