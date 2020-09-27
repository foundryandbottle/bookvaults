AFRAME.registerComponent("button-return", {
  init: function() {
    var El = this.el;
    El.addEventListener("mouseup", function() {
      El.parentNode.parentNode.setAttribute("book-holding", "holding", false);
    });
  }
});
