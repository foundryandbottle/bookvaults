AFRAME.registerComponent("button-flip", {
  init: function() {
    this.front = true;
    this.targetRot = 0;
    this.bookObj = this.el.parentNode.parentNode.children[0];
    this.el.addEventListener("mouseup", this.click.bind(this));
  },

  tick: function() {
    var rotationAttribute = this.bookObj.getAttribute("rotation");

    var rotY = rotationAttribute.y;
    var targetR = this.targetRot;

    if (Math.abs(rotY - targetR) > 0.1) {
      rotY = this.myLerp(rotY, targetR, 0.1);
    }

    this.bookObj.setAttribute("rotation", { x: 0, y: rotY, z: 0 });
  },

  click: function() {
    if (this.front) {
      this.targetRot = 180;
      this.front = false;
    } else {
      this.targetRot = 0;
      this.front = true;
    }

  },

  myLerp: function(v0, v1, t) {
    return v0 * (1 - t) + v1 * t;
  }
});
