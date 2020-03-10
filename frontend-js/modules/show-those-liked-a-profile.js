export default class ShowNames {
  constructor() {
    this.likeButtonSVGContainer = document.querySelector(
      "#like-button-svg-container"
    );
    this.namesContainer = document.querySelector("#names-container");
    this.events();
  }
  // EVENTS
  events() {
    this.likeButtonSVGContainer.addEventListener("mouseover", (e) =>
      this.handleMouseOver(e)
    );
     this.likeButtonSVGContainer.addEventListener("click", e =>
       this.handleMouseOver(e)
     );
    this.likeButtonSVGContainer.addEventListener("mouseout", () =>
      this.handleMouseOut()
    );
  }

  // METHODS
  handleMouseOver(e) {
    this.namesContainer.style.display = "block";
  }
  handleMouseOut() {
    this.namesContainer.style.display = "none";
  }
}
