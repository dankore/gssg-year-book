export default class ConfirmDelete {
    constructor(){
        this.deleteBtn = document.querySelector("#delete-profile");
        this.deleteModal = document.querySelector("#delete-profile-confirm-container");
        this.closeModalBtn = document.querySelector("#close-modal");
        this.htmlBody = document.querySelector("html");
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
    }

    closeModalHandler(){
        this.deleteModal.style.display = "none"
    }

    bodyHandler(){
        this.deleteModal.style.display = "none"
    }
    // END CLASS
}