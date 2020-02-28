export default class Comments {
  constructor() {
    this.editBtnComment = document.querySelectorAll("#edit-button");
    this.containerEditCommentForm = document.querySelectorAll(
      "#comment-edit-container"
    );
    this.events();
  }

  // EVENTS
  events() {
    Array.prototype.forEach.call(this.editBtnComment, button => {
      button.addEventListener("click", e => this.handlerContainerClick(e));
    });
  }

  // METHODS
  handlerContainerClick(e) {
    let currentElem =
      e.currentTarget.parentElement.parentElement.parentElement.parentElement
        .children[2];

    currentElem.style.display = "block";
  }

  // END CLASS
}
