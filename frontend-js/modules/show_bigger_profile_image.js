export default class ToggleImage {
    constructor(){
        this.profileImage = document.querySelector("#profile-image");
        this.closeImage = document.querySelector("#close-image");
        this.profileImageModal = document.querySelector("#profile-image-modal");
        this.body = document.querySelector("body");
        this.events();
    }
    // EVENTS
    events(){
        this.profileImage.addEventListener("click", (e) => this.profileImageHandler(e));
        this.closeImage.addEventListener("click", () => this.closeImageHandler());
        this.body.addEventListener("click", () => this.closeImageHandler())
    }

    // METHODS
    profileImageHandler(e){
        e.stopPropagation();
        if(this.profileImageModal.style.display == "none"){
            this.profileImageModal.style.display = "block"
            this.body.style.backgroundColor = "black"
        } else {
            this.profileImageModal.style.display = "none"
            this.body.style.backgroundColor = "#edf2f7"
        }
    }
    
    closeImageHandler(){
        this.profileImageModal.style.display = "none"
        this.body.style.backgroundColor = "#edf2f7"
    }
    
}