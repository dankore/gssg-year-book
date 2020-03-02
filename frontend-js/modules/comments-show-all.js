export default class ShowAllComments {
  constructor() {
    this.showAllCommentsToggle = document.querySelector(
      "#show-all-comments-toggle"
    );
    this.allCommentsContainer = document.querySelector(
      "#all-comments-container"
    );
    this.beforeClickCommentsCount = document.querySelector(
      "#before-click-comments-count"
    );
    this.afterClickCommentsCount = document.querySelector(
      "#after-click-comments-count"
    );
    this.onPageLoad();
    this.events();
  }

  // EVENTS
  events() {
    this.showAllCommentsToggle.addEventListener("click", _ =>
      this.handleshowAllCommentsToggle()
    );
  }

  // METHODS
  onPageLoad() {
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
    this.beforeClickCommentsCount.style.display = "none";
    this.afterClickCommentsCount.style.display = "block";



    Array.prototype.forEach.call(elementsToHideOnPageLoad, childNode => {
      childNode.style.display = "block";
    });
  }

  // END CLASS
}
