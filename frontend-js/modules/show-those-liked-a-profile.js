export default class ShowNames {
  constructor() {
    this.likeButtonSVGContainer = document.querySelector(
      "#like-button-svg-container"
    );
    this.namesContainer = document.querySelector("#names-container");
    this.main = document.querySelector("main");
    this.events();
  }
  // EVENTS
  events() {
    this.likeButtonSVGContainer.addEventListener("mouseover", () =>
      this.handleMouseOver()
    );
    this.likeButtonSVGContainer.addEventListener("click", () =>
      this.handleMouseOver()
    );
    this.likeButtonSVGContainer.addEventListener("mouseout", () =>
      this.handleMouseOut()
    );
    this.main.addEventListener("click", () => handleCloseNamesConatainer());
  }

  // METHODS
  handleMouseOver() {
    this.namesContainer.style.display = "block";
  }
  handleMouseOut() {
    this.namesContainer.style.display = "none";
  }
  handleCloseNamesConatainer() {
    this.namesContainer.style.display = "none";
  }
  // END CLASS
}
