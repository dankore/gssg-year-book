const axios = require("axios");
export default class Likes {
  constructor() {
    this.likesButton = document.querySelector("#likes-button");
    this.likesContainer = document.querySelector("#likes-container"); 
    this.likesButtonSVG = document.querySelector("#like-button-svg");
    this.likeWordContainer = document.querySelector("#like-word");
    this.events();
  }

  // EVENTS
  events() {
    this.likesButton.addEventListener("click", () => this.handleButtonClick());
  }

  // METHODS
  handleButtonClick() {
      let like = 0;
      if(this.likesButton.classList.contains("like")){
          this.likesButton.classList.remove("like");
          this.likesButton.classList.add("dislike");
          this.likesButtonSVG.style.fill = "#3182ce";
          this.likeWordContainer.style.color = "#3182ce";
          like = 1;
      } else {
          this.likesButton.classList.add("like");
          this.likesButton.classList.remove("dislike");
          this.likesButtonSVG.style.fill = "white";
          this.likeWordContainer.style.color = "black";
          like = -1;
      }
      console.log("like value: " + like);
    axios
      .post("/likes", { like: like })
      .then(response => {
        this.likesContainer.innerHTML = response.data;
      })
      .catch(err => {
        console.log(err);
      });
  }
}
