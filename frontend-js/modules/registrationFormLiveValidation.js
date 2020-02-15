export default class RegistrationFormLiveValidation {
    constructor(){
        this.allFields = document.querySelectorAll("#registration-form .form-control");
        this.insertValidationElements()
        this.events();
    }
    //EVENTS
    events(){
        
    }

    // METHODS
    insertValidationElements(){
        this.allFields.forEach(item =>{
            item.insertAdjacentHTML('beforebegin', '<div class="text-red-600 border border-red-600 bg-red-200">Adamu</div>')
        })
    }

    // END CLASS
}