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
    this.likeButtonSVGContainer.addEventListener("click", () =>
      this.handleButtonClick()
    );
  }

  // METHODS
  handleButtonClick(){
    if(this.namesContainer.style.display == "none"){
      this.namesContainer.style.display = "block";
    } else {
      this.namesContainer.style.display = "none";
    }
  }
 
  // END CLASS
}
