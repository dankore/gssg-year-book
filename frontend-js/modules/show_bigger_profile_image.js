export default class ToggleImage {
    constructor(){
        this.profileImage = document.querySelector("#profile-image");
        this.closeImage = document.querySelector("#close-image");
        this.profileImageModal = document.querySelector("#profile-image-modal");
        this.anchorTag = document.querySelector("#anchor-tag");
        this.events();
    }
    // EVENTS
    events(){
        this.profileImage.addEventListener("click", (e) => this.profileImageHandler(e));
        this.closeImage.addEventListener("click", () => this.closeImageHandler());
        if(this.anchorTag){
         this.anchorTag.addEventListener("click", (e) =>this.anchorTagHandler(e));
        }
    }

    // METHODS
    profileImageHandler(e){
        if(this.profileImageModal.style.display == "none"){
            this.profileImageModal.style.display = "block"
        } else {
            this.profileImageModal.style.display = "none"
        }
    }
    closeImageHandler(){
        this.profileImageModal.style.display = "none"
    }
    // THIS DOES NOT DO ANYTHING. 
    anchorTagHandler(e){
        console.log(e.target)
    }
}