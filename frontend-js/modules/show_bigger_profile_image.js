export default class ToggleImage {
    constructor(){
        this.imageProfile = document.querySelector("#profile-image");
        this.closeImage = document.querySelector("#close-image");
        this.profileImageModal = document.querySelector("#profile-image-modal");
        this.events();
    }
    // EVENTS
    events(){
        this.imageProfile.addEventListener("click", (e) => this.toggleImage(e));
        this.closeImage.addEventListener("click", () => this.closeImageModal())
    }

    // METHODS
    toggleImage(e){
        console.log(e.target)
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