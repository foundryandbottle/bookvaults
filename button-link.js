AFRAME.registerComponent("button-link", {
  init: function() {
    this.el.addEventListener("mouseup", this.linkClick.bind(this));
  },

  linkClick: function() {
    this.bookObj = this.el.parentNode.parentNode.children[0];
    var bookLink = this.bookObj.getAttribute("book-builder").link;
    window.open("https://www.londonbookvaults.com/bookshop/" + bookLink);
  }
});
