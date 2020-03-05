const axios = require("axios");
export default class Likes {
    constructor(){
        this.likesForm = document.querySelector("#likes-form");
        this.likesButton = document.querySelector("#likes-button");
        this.events();
    }

    // EVENTS
    events(){
        this.likesForm.addEventListener("submit", (e) => this.handleLikesFormSubmit(e));
    }

    // METHODS
    handleLikesFormSubmit(e){
        console.log("jij")
        axios.post("/likes", {likesF: 1})
        .then(response => {
            console.log(response.data);
        })
        .catch((err)=>{
            console.log(err)
        })
    }
}