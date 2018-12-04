

function uint8Tob64(arr) {
  var str = "", i = 0, l = arr.length;
  for(;i<l;i++) {
    str+=String.fromCharCode(arr[i]);
  }
  return window.btoa(str);
}


function SetupDigitDraw(parent) {
  var con = document.createElement("div");
  con.className = "canvCon";
  parent.appendChild(con);
  var canv = document.createElement("canvas");
  canv.width=112;
  canv.height=112;
  
  canv.className = "ssCanvas digitCanv";
  var smCanv = document.createElement("canvas");
  smCanv.className = "ssCanvas smallCanv";
  smCanv.width=28;
  smCanv.height=28;
  con.appendChild(smCanv);
  con.appendChild(canv);
  var ctx = canv.getContext("2d");

  var isDrawing = false, offX=0, offY=0, bndMinX=0, bndMaxX=0,bndMinY=0,bndMaxY=0;
  var lX=0,lY=0;
  function onMouseMoveCanv(e) {
    if(isDrawing===true){
      var mX = e.pageX - offX;
      var mY = e.pageY - offY;
      ctx.beginPath();
      ctx.moveTo(lX, lY);
      ctx.lineTo(mX, mY);
      lX = mX;
      lY = mY;
      ctx.closePath();
      ctx.stroke();
    }
  }
  function onMouseDownCanv(e) {
    resetOffXY();
    lX = e.pageX - offX;
    lY = e.pageY - offY;
    isDrawing = true;
  }
  function onMouseUpCanv(e) {
    isDrawing = false;
  }
  function clearDigitCanv(){
    canv.width=canv.width+0;
    canv.height=canv.height+0;
    ctx.fillStyle="#ffffff";
    ctx.fillRect(0,0,canv.width,canv.height);
    ctx.lineWidth = 10;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';

  }
  function resizeCanv(canvas, width, height, resize_canvas) {
      var width_source = canvas.width;
      var height_source = canvas.height;
      width = Math.round(width);
      height = Math.round(height);
  
      var ratio_w = width_source / width;
      var ratio_h = height_source / height;
      var ratio_w_half = Math.ceil(ratio_w / 2);
      var ratio_h_half = Math.ceil(ratio_h / 2);
  
      var ctx = canvas.getContext("2d");
      var img = ctx.getImageData(0, 0, width_source, height_source);
      var img2 = ctx.createImageData(width, height);
      var data = img.data;
      var data2 = img2.data;
  
      for (var j = 0; j < height; j++) {
          for (var i = 0; i < width; i++) {
              var x2 = (i + j * width) * 4;
              var weight = 0;
              var weights = 0;
              var weights_alpha = 0;
              var gx_r = 0;
              var gx_g = 0;
              var gx_b = 0;
              var gx_a = 0;
              var center_y = (j + 0.5) * ratio_h;
              var yy_start = Math.floor(j * ratio_h);
              var yy_stop = Math.ceil((j + 1) * ratio_h);
              for (var yy = yy_start; yy < yy_stop; yy++) {
                  var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
                  var center_x = (i + 0.5) * ratio_w;
                  var w0 = dy * dy; //pre-calc part of w
                  var xx_start = Math.floor(i * ratio_w);
                  var xx_stop = Math.ceil((i + 1) * ratio_w);
                  for (var xx = xx_start; xx < xx_stop; xx++) {
                      var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
                      var w = Math.sqrt(w0 + dx * dx);
                      if (w >= 1) {
                          //pixel too far
                          continue;
                      }
                      //hermite filter
                      weight = 2 * w * w * w - 3 * w * w + 1;
                      var pos_x = 4 * (xx + yy * width_source);
                      //alpha
                      gx_a += weight * data[pos_x + 3];
                      weights_alpha += weight;
                      //colors
                      if (data[pos_x + 3] < 255)
                          weight = weight * data[pos_x + 3] / 250;
                      gx_r += weight * data[pos_x];
                      gx_g += weight * data[pos_x + 1];
                      gx_b += weight * data[pos_x + 2];
                      weights += weight;
                  }
              }
              data2[x2] =255- (gx_r / weights);
              data2[x2 + 1] = 255- (gx_g / weights);
              data2[x2 + 2] = 255- (gx_b / weights);
              data2[x2 + 3] = (data2[x2]);
          }
      }
      resize_canvas.width= resize_canvas.width;
      resize_canvas.height= resize_canvas.height;
      var ctxT = resize_canvas.getContext("2d");
      ctxT.clearRect(0, 0, resize_canvas.width, resize_canvas.height);
      ctxT.putImageData(img2, 0, 0);
  }
  function resetOffXY() {
    var rect = canv.getBoundingClientRect();
    offX = rect.x;
    offY = rect.y;
  }

  function refreshCanvas() {
    resizeCanv(canv, 28, 28, smCanv);
  }

  function initCanv() {


    resetOffXY();
    window.addEventListener("resize", resetOffXY, false);
    resetOffXY();
    canv.addEventListener("mouseup", onMouseUpCanv, false);
    canv.addEventListener("mousedown", onMouseDownCanv, false);
    canv.addEventListener("mousemove", onMouseMoveCanv, false);
    window.requestAnimationFrame(refreshCanvas);
    clearDigitCanv();
  }
  initCanv();
  function getBase64Data() {

    var idata=smCanv.getContext("2d").getImageData(0,0,28,28).data;
    var uintBuf = new Uint8Array(28*28);
    for(var i=0,l=28*28;i<l;i++){
      uintBuf[i] = idata[i*4];
    }
    return uint8Tob64(uintBuf);
  }
  return {
    clear: clearDigitCanv,
    getBase64Data: getBase64Data,
    refresh: refreshCanvas
  };
}
var digitA, digitB;
function refreshAllDigits(){
  if(digitA) {
    digitA.refresh();
  }
  if(digitB) {
    digitB.refresh();
  }
  window.requestAnimationFrame(refreshAllDigits);
}
function getDigitValues() {
  var digitAValue = -1;
  return window.exAPI.ml.ocrDigit(digitA.getBase64Data())
  .then(function(res){
    if(typeof res!=='number' || res < 0) {
      throw new Error("Invalid response for digit A");
    }
    digitAValue = res;
    return window.exAPI.ml.ocrDigit(digitB.getBase64Data())
  })
  .then(function(res){
    if(typeof res!=='number' || res < 0) {
      throw new Error("Invalid response for digit B");
    }
    return {a: digitAValue, b: res};
  })
}
function enableButtons(enable) {
  document.getElementById("opBtnAdd").disabled = !enable;
  document.getElementById("opBtnMul").disabled = !enable;
  document.getElementById("opBtnSub").disabled = !enable;
  document.getElementById("opBtnDiv").disabled = !enable;
}
function putResult(value) {
  document.getElementById("opErrMsg").innerText="";
  if(typeof value==='number' && value!==Math.floor(value)) {
    value = value.toFixed(3);
  }
  document.getElementById("opDigitResult").innerText = value+"";
}
function multiplyDigits(){
  document.getElementById("opDigitResult").innerText="";
  enableButtons(false);
  getDigitValues()
  .then(function(result){
    return window.exAPI.math.multiply(result.a, result.b);
  })
  .then(function(result){
    putResult(result);
    enableButtons(true);
  })
  .catch(function(err){
    document.getElementById("opErrMsg").innerText=err+"\n";
    enableButtons(true);
  })
}
function divideDigits(){
  document.getElementById("opDigitResult").innerText="";
  enableButtons(false);
  getDigitValues()
  .then(function(result){
    return window.exAPI.math.divide(result.a, result.b);
  })
  .then(function(result){
    putResult(result);
    enableButtons(true);
  })
  .catch(function(err){
    document.getElementById("opErrMsg").innerText=err+"\n";
    enableButtons(true);
  })
}
function addDigits(){
  document.getElementById("opDigitResult").innerText="";
  enableButtons(false);
  getDigitValues()
  .then(function(result){
    return window.exAPI.math.add(result.a, result.b);
  })
  .then(function(result){
    putResult(result);
    enableButtons(true);
  })
  .catch(function(err){
    document.getElementById("opErrMsg").innerText=err+"\n";
    enableButtons(true);
  })
}
function subtractDigits(){
  document.getElementById("opDigitResult").innerText="";
  enableButtons(false);
  getDigitValues()
  .then(function(result){
    return window.exAPI.math.subtract(result.a, result.b);
  })
  .then(function(result){
    putResult(result);
    enableButtons(true);
  })
  .catch(function(err){
    document.getElementById("opErrMsg").innerText=err+"\n";
    enableButtons(true);
  })
}
function initDraw() {
  digitA = SetupDigitDraw(document.getElementById("digitConA"));
  digitB = SetupDigitDraw(document.getElementById("digitConB"));
  
  window.requestAnimationFrame(refreshAllDigits);
  document.getElementById("clearBtnA").addEventListener("click", function(){
    digitA.clear();
  }, false);
  document.getElementById("clearBtnB").addEventListener("click", function(){
    digitB.clear();
  }, false);
  document.getElementById("opBtnAdd").addEventListener("click", function(){
    addDigits();
  }, false);
  document.getElementById("opBtnSub").addEventListener("click", function(){
    subtractDigits();
  }, false);
  document.getElementById("opBtnDiv").addEventListener("click", function(){
    divideDigits();
  }, false);
  document.getElementById("opBtnMul").addEventListener("click", function(){
    multiplyDigits();
  }, false);


}