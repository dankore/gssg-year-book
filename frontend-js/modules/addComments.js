const axios = require("axios");

export default class AddComments {
  constructor() {
    this.input = document.querySelector("#input-comment");
    this.button = document.querySelector("#button-comment");
    this.events();
  }

  events() {
    this.button.addEventListener("click", () => this.handleClick());
  }

  handleClick() {
    axios.post("/get-comments", { comment: this.input.value }).then(res => {
      console.log(res.data);
    });
  }
}
