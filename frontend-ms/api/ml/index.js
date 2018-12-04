const express = require('express');
const mlService = require('../../services/ml');

const router = express.Router();

router.post('/ocr_digit', (req, res)=>{
  let image = req.body.image;
  if(typeof image!=='string'||image.length<4||image.length>4000) {
    return res.status(400).json({error: "Invalid image input"});
  }
  mlService.predictDigitFromImage(image)
  .then((result)=>{
    res.json({result: result});
  })
  .catch((err)=>{
    res.status(500).json({error: err+""});
  })
});


module.exports = router;