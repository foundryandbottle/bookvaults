AFRAME.registerComponent("holding-manager", {
  init: function() {
    var heldBook;
    this.el.addEventListener("newhold", function(e) {
      if(heldBook != undefined)
        {
          heldBook.setAttribute("book-holding", "holding", false);
        }
      heldBook = e.detail.heldEl; 
    });
  }
});
