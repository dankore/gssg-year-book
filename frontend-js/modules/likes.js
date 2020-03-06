const axios = require("axios");
export default class Likes {
  constructor() {
    this.likesButton = document.querySelector("#likes-button");
    this.likesContainer = document.querySelector("#likes-container");
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
          like = 1;
      } else {
          this.likesButton.classList.add("like");
          this.likesButton.classList.remove("dislike");
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
