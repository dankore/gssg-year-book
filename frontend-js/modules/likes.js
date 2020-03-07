const axios = require("axios");
export default class Likes {
  constructor() {
    this.likesButton = document.querySelector("#likes-button");
    this.likesContainer = document.querySelector("#likes-container");
    this.likesButtonSVG = document.querySelectorAll("#like-button-svg");
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
    let color = "";
    if (this.likesButton.classList.contains("yes")) {
      like = -1;
      color = "no";
      this.likesButton.classList.remove("yes");
      this.likesButton.classList.add("no");
      Array.prototype.forEach.call(this.likesButtonSVG, svg => {
        svg.classList.remove("yes");
        svg.classList.add("no");
      });
    } else {
      like = 1;
      color = "yes";
      this.likesButton.classList.remove("no");
      this.likesButton.classList.add("yes");
      Array.prototype.forEach.call(this.likesButtonSVG, svg => {
        svg.classList.add("yes");
        svg.classList.remove("no");
      });
    }
    console.log("like value: " + like, color);
    axios
      .post("/likes", { like: like, color: color })
      .then(response => {
        this.likesContainer.innerHTML = response.data[0].totalLikes;
        console.log(response.data[0], color);
      })
      .catch(err => {
        console.log(err);
      });
  }
}
