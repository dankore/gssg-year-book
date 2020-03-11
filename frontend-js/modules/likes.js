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
    if (this.likesButton.classList.contains("yes-toggle")) {
      like = -1;
      color = "no";
      this.likesButton.classList.remove("yes-toggle");
      this.likesButton.classList.add("no-toggle");
      this.likeWordContainer.classList.remove("yes-like-color");

      Array.prototype.forEach.call(this.likesButtonSVG, svg => {
        svg.classList.remove("yes");
        svg.classList.add("no");
        svg.style.fill = "white";
      });
    } else {
      like = 1;
      color = "yes";
      this.likesButton.classList.remove("no-toggle");
      this.likesButton.classList.add("yes-toggle");
      this.likeWordContainer.classList.add("yes-like-color");

      Array.prototype.forEach.call(this.likesButtonSVG, svg => {
        svg.classList.add("yes");
        svg.classList.remove("no");
        svg.style.fill = "#3182ce";
      });
    }
    axios
      .post("/likes", { like: like, color: color })
      .then(response => {
        axios.post("/get-visited-profile-doc").then(res => {
          let arrayOfNames = [];
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].color == "yes") {
              arrayOfNames.push(res.data[i].visitorName);
            }
          }

          if (arrayOfNames.length < 1) {
            //  <!-- DO NOTHING -->
          } else if (arrayOfNames.length == 1) {
            this.likesContainer.innerHTML = `Liked by ${arrayOfNames[0]}`;
          } else if (arrayOfNames.length == 2) {
            this.likesContainer.innerHTML = `Liked by ${arrayOfNames.slice(
              0,
              1
            )} and ${arrayOfNames.slice(1).length} other`;
          } else {
            this.likesContainer.innerHTML = `Liked by ${arrayOfNames.slice(
              0,
              1
            )} and ${arrayOfNames.slice(1).length} others`;
          }
        });
        // this.test.innerHTML = response.data[0].visitorName;
        /**
         * @this.likesContainer.innerHTML = response.data[0].totalLikes
         * is slower. Used this.likesContainer.textContent = +this.likesContainer.textContent + 1 /-1 instead;
         */
      })
      .catch(err => {
        console.log(err);
      });
  }
}
