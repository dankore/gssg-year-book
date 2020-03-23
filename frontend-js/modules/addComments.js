const axios = require("axios");

export default class AddComments{
  constructor(){
    this.input = document.querySelector("#input-comment");
    this.button = document.querySelector("#button-comment");
    this.events();
  }

  events(){
    this.button.addEventListener("click", ()=>this.handleClick());
  }

  handleClick(){
   let text = this.input.value
    axios.post("get-comments", {comment: text})
    .then(res =>{
      console.log(res.data)
    })
  }
}