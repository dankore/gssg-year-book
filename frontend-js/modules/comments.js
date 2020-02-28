export default class Comments {
  constructor() {
    this.editBtnComment = document.querySelectorAll("#edit-button");
    this.cancelEditBtn = document.querySelectorAll("#cancel-edit-comment");
    this.events();
  }

  // EVENTS
  events() {
    Array.prototype.forEach.call(this.editBtnComment, editBtn => {
      editBtn.addEventListener("click", e => this.handlerEditBtnClick(e));
    });
    Array.prototype.forEach.call(this.cancelEditBtn, cancelBtn => {
      cancelBtn.addEventListener("click", e => this.handleCancelBtnClick(e));
    });
  }

  // METHODS
  handlerEditBtnClick(e) {
    const currentElem =
      e.currentTarget.parentElement.parentElement.parentElement.parentElement
        .children[2];
    currentElem.style.display = "block";
  }

  handleCancelBtnClick(e) {
    const currentElem = e.currentTarget.parentElement.parentElement;
    currentElem.style.display = "none";
  }

  // END CLASS
}
