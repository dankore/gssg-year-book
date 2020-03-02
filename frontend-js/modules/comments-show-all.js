export default class ShowAllComments {
  constructor() {
    this.showAllCommentsToggle = document.querySelector(
      "#show-all-comments-toggle"
    );
    this.allCommentsContainer = document.querySelector(
      "#all-comments-container"
    );
    this.test();
    this.events();
  }

  // EVENTS
  events() {
    this.showAllCommentsToggle.addEventListener("click", _ =>
      this.handleshowAllCommentsToggle()
    );
  }

  // METHODS
  test() {
    const elementsToHideOnPageLoad = Array.from(
      this.allCommentsContainer.children
    ).slice(2);

    Array.prototype.forEach.call(elementsToHideOnPageLoad, childNode => {
      childNode.style.display = "none";
    });
  }
  handleshowAllCommentsToggle() {
    const elementsToHideOnPageLoad = Array.from(
      this.allCommentsContainer.children
    ).slice(2);

    Array.prototype.forEach.call(elementsToHideOnPageLoad, childNode => {
      childNode.style.display = "block";
    });
  }

  // END CLASS
}
