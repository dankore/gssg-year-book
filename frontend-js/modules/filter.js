export default class Filter {
    constructor(){
        this.filterIcon = document.getElementById("filter-icon");
        this.formContainer = document.getElementById("form-container");
        this.events();
    }
    // EVENTS
    events(){
        this.filterIcon.addEventListener("click", ()=> this.handleFilterIcon());
    }

    // METHODS
    handleFilterIcon(){
        if(this.formContainer.style.display == "none"){
            this.formContainer.style.display = "block";
        } else {
            this.formContainer.style.display = "none";
        }
    }
}