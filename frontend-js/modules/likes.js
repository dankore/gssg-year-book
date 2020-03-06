const axios = require("axios");
export default class Likes {
    constructor(){
        this.likesButton = document.querySelector("#likes-button");
        this.likesContainer = document.querySelector("#likes-container");
        this.events();
    }

    // EVENTS
    events(){
        this.likesButton.addEventListener("click", () => this.handleButtonClick());
    }

    // METHODS
    handleButtonClick(){
        axios.post("/likes", {likesF: 1})
        .then(response => {
            this.likesContainer.innerHTML = response.data;
        })
        .catch((err)=>{
            console.log(err)
        })
    }
}