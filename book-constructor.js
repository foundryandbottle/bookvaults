var bvIndex;

function getXHR() {
  if (window.XMLHttpRequest) {
    return new XMLHttpRequest();
  }
  try {
    return new ActiveXObject("MSXML2.XMLHTTP.6.0");
  } catch (e) {
    try {
      // The fallback.
      return new ActiveXObject("MSXML2.XMLHTTP.3.0");
    } catch (e) {
      throw new Error("This browser does not support XMLHttpRequest.");
    }
  }
}

function getJSON(url, callback) {
  req = getXHR();
  req.open("GET", url);
  req.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var jsonObject = null,
        status;
      try {
        jsonObject = JSON.parse(req.responseText);
        status = "success";
      } catch (e) {
        status = "Invalid JSON string[" + e + "]";
      }
      callback(jsonObject, status, this);
    }
  };
  req.onerror = function() {
    callback(null, "error", null);
  };
  req.send(null);
}
getJSON("https://raw.githubusercontent.com/foundryandbottle/bookvaults/master/booklist.json", function(jsonObject, status, xhr) {
  bvIndex = jsonObject;
});

AFRAME.registerComponent("book-builder", {
  schema: {
    indexNum: { type: "int" },
    link: { type: "string" }
  },

  tick: function() {
    if (this.isDone) {
      return;
    } else if (bvIndex.W[this.data.indexNum] == undefined) {
      this.isDone = true;
      return;
    } else {
      var El = this.el;
      var bookW = bvIndex.W[this.data.indexNum];
      var bookH = bvIndex.H[this.data.indexNum];
      var bookD = bvIndex.D[this.data.indexNum];
      var bookSKU = bvIndex.SKU[this.data.indexNum];
      var bookLink = bvIndex.LINK[this.data.indexNum];

      let front = document.createElement("a-plane");
      let side = document.createElement("a-plane");
      let back = document.createElement("a-plane");
      let pagestop = document.createElement("a-plane");
      let pagesside = document.createElement("a-plane");
      let pagesbottom = document.createElement("a-plane");
      
      side.object3D.rotateY(Math.PI / -2);
      back.object3D.rotateY(Math.PI);

      front.object3D.translateZ(0.5);
      side.object3D.translateZ(0.5);
      back.object3D.translateZ(0.5);

      pagestop.object3D.scale.set(0.98, 0.98, 0.98);
      pagesside.object3D.scale.set(0.98, 0.98, 0.98);
      pagesbottom.object3D.scale.set(0.98, 0.98, 0.98);
      
      pagestop.object3D.translateY(0.49);
      pagesside.object3D.translateX(0.49);
      pagesbottom.object3D.translateY(-0.49);
      
      pagestop.object3D.rotateX(Math.PI/-2);
      pagesside.object3D.rotateY(Math.PI/2);
      pagesside.object3D.rotateZ(Math.PI/2);
      pagesbottom.object3D.rotateX(Math.PI/2);
      
      El.object3D.scale.set(bookW, bookH, bookD);

      var frontMatLink =
        "https://raw.githubusercontent.com/foundryandbottle/bookvaults/master/" +
        bookSKU +
        "_FRONT.jpg";
      var sideMatLink =
        "https://raw.githubusercontent.com/foundryandbottle/bookvaults/master/" +
        bookSKU +
        "_SIDE.jpg";
      var backMatLink =
        "https://raw.githubusercontent.com/foundryandbottle/bookvaults/master/" +
        bookSKU +
        "_BACK.jpg";

      front.setAttribute("material", { src: frontMatLink });
      side.setAttribute("material", { src: sideMatLink });
      back.setAttribute("material", { src: backMatLink });
      pagestop.setAttribute("material", { src: "https://raw.githubusercontent.com/foundryandbottle/bookvaults/master/pages.jpg" });
      pagesside.setAttribute("material", { src: "https://raw.githubusercontent.com/foundryandbottle/bookvaults/master/pages.jpg" });
      pagesbottom.setAttribute("material", { src: "https://raw.githubusercontent.com/foundryandbottle/bookvaults/master/pages.jpg" });

      El.appendChild(front);
      El.appendChild(side);
      El.appendChild(back);
      El.appendChild(pagestop);
      El.appendChild(pagesside);
      El.appendChild(pagesbottom);

      this.el.object3D.translateY(bookH / 2 - 0.1);
    
      
      this.el.setAttribute("book-builder", {link: bookLink});
      this.isDone = true;
    }
  }
});
