window.exAPI=(function(){
var api = axios.create({
  baseURL: '/api/v1'
});
function ocrDigit(imgBase64String) {
  return api.post('/ml/ocr_digit', {image: imgBase64String})
  .then((res)=>{
    if(!res || !res.data || typeof res.data!=='object' || typeof res.data.result!=='number') {
      throw new Error("Error in server response");
    }
    return res.data.result;
  })
}
function multiply(a, b) {
  return api.post('/math/multiply', {a: a, b: b})
  .then((res)=>{
    if(!res || !res.data || typeof res.data!=='object' || typeof res.data.result!=='number') {
      throw new Error("Error in server response");
    }
    return res.data.result;
  })
}
function divide(a, b) {
  return api.post('/math/divide', {a: a, b: b})
  .then((res)=>{
    if(!res || !res.data || typeof res.data!=='object' || typeof res.data.result!=='number') {
      throw new Error("Error in server response");
    }
    return res.data.result;
  })
}
function add(a, b) {
  return api.post('/math/add', {a: a, b: b})
  .then((res)=>{
    if(!res || !res.data || typeof res.data!=='object' || typeof res.data.result!=='number') {
      throw new Error("Error in server response");
    }
    return res.data.result;
  })
}
function subtract(a, b) {
  return api.post('/math/subtract', {a: a, b: b})
  .then((res)=>{
    if(!res || !res.data || typeof res.data!=='object' || typeof res.data.result!=='number') {
      throw new Error("Error in server response");
    }
    return res.data.result;
  })
}

function pow(a, b) {
  return api.post('/math/pow', {a: a, b: b})
  .then((res)=>{
    if(!res || !res.data || typeof res.data!=='object' || typeof res.data.result!=='number') {
      throw new Error("Error in server response");
    }
    return res.data.result;
  })
}

return {
  ml: {ocrDigit: ocrDigit},
  math: {
    multiply: multiply,
    divide: divide,
    add: add,
    subtract: subtract,
    pow: pow,
  }
};

})();