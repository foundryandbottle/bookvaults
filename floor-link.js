AFRAME.registerComponent("floor-link", {
  init: function() {
    this.el.addEventListener("mouseup", function() {
      window.open("https://www.foundryandbottle.com");
    });
  }
});
