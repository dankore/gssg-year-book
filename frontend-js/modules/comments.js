export default class Comments {
  constructor() {
    this.editBtn = document.querySelectorAll("#edit-button");
    this.cancelEditBtn = document.querySelectorAll("#cancel-edit-comment");
    this.updateBtn = document.querySelectorAll("#update-comment");
    this.editForm = document.querySelectorAll("#edit-comment-form");
    this.events();
  }

  // EVENTS
  events() {
    Array.prototype.forEach.call(this.editBtn, editBtn => {
      editBtn.addEventListener("click", e => this.handlerEditBtnClick(e));
    });
    Array.prototype.forEach.call(this.cancelEditBtn, cancelBtn => {
      cancelBtn.addEventListener("click", e => this.handleCancelBtnClick(e));
    });
    Array.prototype.forEach.call(this.updateBtn, updateBtn => {
        updateBtn.addEventListener("click", e => this.handleUpdateBtnClick(e));
    })
  }

  // METHODS
  handlerEditBtnClick(e) {
    const currentElem =
      e.currentTarget.parentElement.parentElement.parentElement.children[2];
    currentElem.style.display = "block";
  }

  handleCancelBtnClick(e) {
    const currentElem = e.currentTarget.parentElement.parentElement;
    currentElem.style.display = "none";
  }

  handleUpdateBtnClick(e){
      const formElem = e.currentTarget.parentElement.parentElement.children[0];
      formElem.submit();
    // console.log(e.currentTarget.parentElement.parentElement.children[0])
    
  }

  // END CLASS
}
