export default class ConfirmDelete {
    constructor(){
        this.deleteBtn = document.querySelector("#delete-profile");
        this.deleteModal = document.querySelector("#delete-profile-confirm-container");
        this.closeModalBtn = document.querySelector("#close-modal");
        this.htmlBody = document.querySelector("html");
        this.body = document.querySelector("body")
        this.events();
    }
    // EVENTS
    events(){
        this.deleteBtn.addEventListener("click", (e) => this.deleteHandler(e));
        this.closeModalBtn.addEventListener("click", () => this.closeModalHandler());
        this.htmlBody.addEventListener("click", () => this.bodyHandler());
    }

    // METHODS
    deleteHandler(e){
        e.stopPropagation();
        this.deleteModal.style.display = "block"
        this.body.style.setProperty("background-color", "black")
    }

    closeModalHandler(){
        this.deleteModal.style.display = "none"
        this.body.style.backgroundColor = "#edf2f7";
    }

    bodyHandler(){
        this.deleteModal.style.display = "none"
        this.body.style.backgroundColor = "#edf2f7";
    }
    // END CLASS
}