export default class EditCancelUpdateComments {
  constructor() {
    this.editBtn = document.querySelectorAll("#edit-button");
    this.cancelEditBtn = document.querySelectorAll("#cancel-edit-comment");
    this.updateBtn = document.querySelectorAll("#update-comment-button");
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
    });
  }

  // METHODS
  handlerEditBtnClick(e) {
    const editCommentFormContainer =
      e.currentTarget.parentElement.parentElement.parentElement.children[2];
    editCommentFormContainer.style.display = "block";
  }

  handleCancelBtnClick(e) {
    const editCommentFormContainer =
      e.currentTarget.parentElement.parentElement;
    editCommentFormContainer.style.display = "none";
  }

  handleUpdateBtnClick(e) {
    const editCommentFormContainer =
      e.currentTarget.parentElement.parentElement.children[0];
    editCommentFormContainer.submit(); // SUBMIT FORM
  }

  // END CLASS
}
