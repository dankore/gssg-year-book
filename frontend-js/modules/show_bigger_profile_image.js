export default class ToggleImage {
    constructor(){
        this.image = document.querySelector("#profile-image");
        this.closeImage = document.querySelector("#close-image");
        this.profileImageModal = document.querySelector("#profile-image-modal");
        this.events();
    }
    // EVENTS
    events(){
        this.image.addEventListener("click", () => this.toggleImage());
        this.closeImage.addEventListener("click", () => this.closeImageModal())
    }

    // METHODS
    toggleImage(){
        if(this.profileImageModal.style.display == "none"){
            this.profileImageModal.style.display = "block"
        } else {
            this.profileImageModal.style.display = "none"
        }
    }
    closeImageModal(){
        this.profileImageModal.style.display = "none"
    }
}