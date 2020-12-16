// 분기
if (mo_chk() == "ios") {
} else {
  var isKakao = /kakaotalk/i.test(navigator.userAgent.toLowerCase());
  var isFace = /fban|fbav/i.test(navigator.userAgent.toLowerCase());
  var isInstar = /instagram/i.test(navigator.userAgent.toLowerCase());
  var isLot = /lddi/i.test(navigator.userAgent.toLowerCase());
  if (isKakao || isFace || isInstar || isLot) {
    location.href =
      "intent://lineup-ydp.com/step2#Intent;scheme=http;package=com.android.chrome;end";
    location.href = "/";
  }
}

var headItem = -1;
var headUrl = "";
var headUrlSit = "";

var sitItem = "stand";

var bodyItem = -1;
var bodyUrl = "";

var dreaItem = -1;
var dreaUrl = "";
var dreaTag = "";

var itemItem = new Array();
var itemUrl = new Array();

var sendArr = new Array();

var default_head = "/assets/image/ava/default/head.png";
var default_headsit = "/assets/image/ava/default/head_sit.png";
var default_body = "/assets/image/ava/default/body.png";
var default_item = "/assets/image/temp/top-acc/default.png";
var default_bg = "/assets/image/make/ava_bg.png";

var max_w = 640;
var max_h = 640;

var c_w = 0;
var c_h = 0;

var g_image = null;

var total_cnt = 0;
var toNum = 0;
var imageArr = new Array();

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

window.onload = function () {
  initCanvars();
  initPeoPle();
};
function initPeoPle() {
  var imageObj1 = new Image();
  var imageObj2 = new Image();
  var imageObj3 = new Image();

  sendArr = [];
  imageObj2.src = default_head;
  sendArr.push(default_head);
  imageObj2.onload = function () {
    ctx.globalAlpha = 1;
    ctx.drawImage(imageObj2, 0, 0, max_w, max_h);
    imageObj1.src = default_body;
    sendArr.push(default_body);
    imageObj1.onload = function () {
      ctx.globalAlpha = 1;
      ctx.drawImage(imageObj1, 0, 0, max_w, max_h);
      canvas.style.width = c_w + "px";
      canvas.style.height = c_h + "px";
    };
  };
}
function initCanvars() {
  var make_mid_container = document.getElementById("make_mid_container");
  c_w = make_mid_container.offsetWidth;
  c_h = make_mid_container.offsetHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
}
function setImage(type, index, url, siturl, sitgubun, tag) {
  if (type == 2) {
    if (itemItem.includes(index + "")) {
      var idx = itemItem.indexOf(index + "");
      itemItem.splice(idx, 1);
      var idx1 = itemUrl.indexOf(url);
      itemUrl.splice(idx1, 1);
    } else {
      itemItem.push(index + "");
      itemUrl.push(url);

      //
      var tmp_itemItem = new Array(); // new
      var tmp_itemUrl = new Array(); // new
      var itemItem1 = itemItem; // copy
      var itemUrl1 = itemUrl; // copy

      var number_index = [9, 1, 0, 2, 3, 8, 6, 7, 4, 5];

      for (var i = 0; i < number_index.length; i++) {
        var ss = itemItem.indexOf(number_index[i] + "");
        if (ss != -1) {
          tmp_itemItem.push(itemItem1[ss] + "");
          tmp_itemUrl.push(itemUrl1[ss]);
        }
      }
      itemItem = [];
      itemUrl = [];
      for (var i = 0; i < tmp_itemItem.length; i++) {
        itemItem.push(tmp_itemItem[i]);
        itemUrl.push(tmp_itemUrl[i]);
      }
    }
  } else {
    if (type == 0) {
      headItem = index;
      headUrl = url;
      headUrlSit = siturl;
    } else if (type == 1) {
      bodyItem = index;
      bodyUrl = url;
      sitItem = sitgubun;
    } else if (type == 3) {
      dreaItem = index;
      dreaUrl = url;
      dreaTag = tag;
    }
  }

  // menu set start
  if (type == 2) {
    var len = $(".rec-pic").length;
    for (var i = 0; i < len; i++) {
      $(".rec-pic:eq(" + i + ")").removeClass("active");
    }
    for (var i = 0; i < itemItem.length; i++) {
      $(".rec-pic:eq(" + itemItem[i] + ")").addClass("active");
    }
  } else {
    var len = $(".rec-pic").length;
    for (var i = 0; i < len; i++) {
      $(".rec-pic:eq(" + i + ")").removeClass("active");
    }

    $(".rec-pic:eq(" + index + ")").addClass("active");
  }
  // menu set end

  imageChange();
}
async function imageChange() {
  initCanvars();
  // default setting
  if (headUrl != "") {
  } else {
    headUrl = default_head;
    headUrlSit = default_headsit;
    headItem = -1;
  }
  if (bodyUrl != "") {
  } else {
    bodyItem = -1;
    bodyUrl = default_body;
  }
  if (dreaUrl != "") {
  } else {
    dreaItem = -1;
    dreaUrl = default_item;
  }

  sendArr = [];
  for (var i = 0; i < itemUrl.length; i++) {
    sendArr.push(itemUrl[i]);
  }
  if (sitItem == "stand") {
    sendArr.push(headUrl);
  } else {
    sendArr.push(headUrlSit);
  }
  sendArr.push(bodyUrl);
  sendArr.push(dreaUrl);

  total_cnt = sendArr.length;
  imageArr = [];
  for (var i = 0; i < total_cnt; i++) {
    imageArr[i] = new Image();
  }
  toNum = 0;
  drawImageNew(0, sendArr);
}
function drawImageNew(num, sendArr) {
  imageArr[num].src = sendArr[num];
  imageArr[num].onload = function () {
    ctx.globalAlpha = 1;
    ctx.drawImage(imageArr[num], 0, 0, max_w, max_h);
    if (toNum + 1 == total_cnt) {
      setCanvas();
      return true;
    } else {
      toNum += 1;
      drawImageNew(toNum, sendArr);
    }
  };
}
function setCanvas() {
  canvas.style.width = c_w + "px";
  canvas.style.height = c_h + "px";
}
function fileupload() {
  var canvas = document.createElementId("canvas");
  var imgDataUrl = canvas.toDataURL("image/png");
  var blobBin = atob(imgDataUrl.split(",")[1]);
  var array = [];
  for (var i = 0; i < blobBin.length; i++) {
    array.push(blobBin.charCodeAt(i));
  }
  var file = new Blob([new Uint8Array(array)], { type: "image/png" });
  saveAs(file, "image.jpeg");
}
