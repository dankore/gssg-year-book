export default class ClickToComment {
  constructor() {
    this.clickToCommentBtn = document.getElementById("click-to-comment");
    this.textareaComment = document.getElementById("input-comment");
    this.events();
  }
  // EVENTS
  events() {
    this.clickToCommentBtn.addEventListener("click", () =>
      this.handleClickcommentBtn()
    );
  }

  // METHODS
  handleClickcommentBtn() {
    this.textareaComment.focus();
  }
}
