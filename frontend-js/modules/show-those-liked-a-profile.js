const axios = require("axios");
export default class ShowNames {
  constructor() {
    this.likesContainer = document.querySelector("#likes-container");
    this.namesContainerUL = document.querySelector("#names-container-ul");
    this.events();
  }
  // EVENTS
  events() {
    this.likesContainer.addEventListener("click", () =>
      this.handleButtonClick()
    );
  }

  // METHODS
  handleButtonClick() {
    axios
      .post("/get-visited-profile-doc")
      .then(res => {
        /**
         * GET THE NAMES OF PROFILES WHO LIKED THIS PROFILE
         * IF @COLOR == "YES" MEANS PROFILE CURRENTLY LIKES THIS PROFILE
         */
        let arrayOfNames = [];
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].color == "yes") {
            arrayOfNames.push(res.data[i].visitorName);
          }
        }
        // TOGGLE
        if (this.namesContainerUL.style.display == "none") {
          this.namesContainerUL.innerHTML = arrayOfNames
            .map(item => {
              return `<li>${item}</li>`;
            })
            .join("");
          this.namesContainerUL.style.display = "block";
        } else {
          this.namesContainerUL.style.display = "none";
        }
        // TOGGLE ENDS
      })
      .catch(err => {
        this.namesContainerUL.innerHTML = err;
      });
  }

  // END CLASS
}
