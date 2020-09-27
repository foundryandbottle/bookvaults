AFRAME.registerComponent("book-holding", {
  schema: {
    holding: { type: "bool" }
  },
  init: function() {
    this.data.holding = false;
    this.hovering = false;
    var El = this.el;
    this.runClickTimer = false;
    this.quickClickTimer = 150;
    this.runHoverTimer = false;
    this.hoverMoveTimer = 0;

    El.addEventListener("mousedown", this.clickDown.bind(this));
    El.addEventListener("mouseup", this.clickUp.bind(this));

    El.addEventListener("mouseenter", this.hoverStart.bind(this));
    El.addEventListener("mouseleave", this.hoverEnd.bind(this));

    this.uiObj = this.el.object3D.children[1];
    if (this.uiObj != undefined) {
      this.uiObj.visible = false;
    }
  },

  update: function() {},

  tick: function(time, deltaTime) {
    if (this.runClickTimer) {
      this.quickClickTimer -= 1 * deltaTime;
    }

    if (this.runHoverTimer && this.hoverMoveTimer > 0) {
      this.hoverMoveTimer -= 1 * deltaTime;
    }

    if (this.hovering || this.data.holding) {
      this.lookAtCamera();
    } else {
      this.lookForward();
    }

    if (this.data.holding) {
      this.moveToCamera();
    } else {
      this.moveToShelf();
    }
  },

  clickDown: function(e) {
    if (this.data.holding == false) {
      this.runClickTimer = true;
    }
  },
  clickUp: function(e) {
    if (
      this.quickClickTimer > 0 &&
      this.quickClickTimer < 150 &&
      this.data.holding == false
    ) {
      //picking a book up
      this.el.emit("newhold", { heldEl: this.el }, true);
      this.data.holding = true;
      this.hoverMoveTimer = 0;
    }
    this.runClickTimer = false;
    this.quickClickTimer = 150;

  },


  hoverStart: function() {
    this.runHoverTimer = false;
    this.hoverMoveTimer = 1000;
    this.hovering = true;
  },

  hoverEnd: function() {
    //rotate home
    if (this.data.holding == false) {
    }

    this.runHoverTimer = true;
    this.hovering = false;
  },


  moveToCamera: function() {
    var cameraEl = this.el.sceneEl.camera.el;
    var cameraElPos = cameraEl.getAttribute("position");
    var cameraLocalPos = new THREE.Vector3();
    cameraLocalPos = cameraEl.object3D.position;

    var cameraTargetPos = new THREE.Vector3(0, 0, -0.25);

    var cameraWorldTarget = new THREE.Vector3();
    cameraWorldTarget = cameraEl.object3D.localToWorld(cameraTargetPos);

    var targetPos = new THREE.Vector3(
      cameraWorldTarget.x,
      cameraWorldTarget.y,
      cameraWorldTarget.z
    );
    var localTargetPos = new THREE.Vector3();
    localTargetPos = this.el.object3D.parent.worldToLocal(targetPos);

    var positionAttribute = this.el.getAttribute("position");
    var position = new THREE.Vector3(
      positionAttribute.x,
      positionAttribute.y,
      positionAttribute.z
    );
    position.lerp(localTargetPos, 0.1);
    this.el.setAttribute("position", position);

    if (this.uiObj != undefined) {
      if (this.uiObj.visible != true) this.uiObj.visible = true;
    }
  },

  moveToShelf: function() {
    var initPosVec = new THREE.Vector3(0, 0, 0);
    var targetPos = new THREE.Vector3();
    var hoverOffset = new THREE.Vector3(0, 0, 0.1);

    if (this.hoverMoveTimer > 0) {
      targetPos = initPosVec.add(hoverOffset);
    } else {
      targetPos = initPosVec;
    }
    var positionAttribute = this.el.getAttribute("position");
    var position = new THREE.Vector3(
      positionAttribute.x,
      positionAttribute.y,
      positionAttribute.z
    );
    position.lerp(targetPos, 0.1);

    this.el.setAttribute("position", position);

    if (this.uiObj != undefined) {
      if (this.uiObj.visible == true) this.uiObj.visible = false;
    }
  },

  lookAtCamera: function() {

    var cameraEl = this.el.sceneEl.camera.el;
    var cameraElPos = cameraEl.getAttribute("position");

    var lookCameraTarget = this.currentLook();

    lookCameraTarget.lerp(cameraElPos, 0.1);
    this.el.object3D.lookAt(lookCameraTarget);
  },

  lookForward: function() {
    var initLookPosVec = new THREE.Vector3(0, 0, 0);
    var initLookPosForward = new THREE.Vector3(0, 0, 1);
    var initTarget = new THREE.Vector3();
    var initLookTarget = new THREE.Vector3();

    initTarget = initLookPosVec.add(initLookPosForward);
    initLookTarget = this.el.object3D.parent.localToWorld(initTarget);


    var lookForwardTarget = this.currentLook();

    lookForwardTarget.lerp(initLookTarget, 0.2);

    this.el.object3D.lookAt(lookForwardTarget);
  },

  currentLook: function() {
    var El = this.el;
    var elForward = new THREE.Vector3();
    var elWorldPos = new THREE.Vector3();
    var elForwardPos = new THREE.Vector3();

    El.object3D.getWorldDirection(elForward);
    El.object3D.getWorldPosition(elWorldPos);

    elForwardPos = elWorldPos.add(elForward);

    var LT = new THREE.Vector3(elForwardPos.x, elForwardPos.y, elForwardPos.z);
    return LT;
  }
});
