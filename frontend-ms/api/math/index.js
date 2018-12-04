const express = require('express');
const mathService = require('../../services/math');

const router = express.Router();

router.post('/multiply', (req, res)=>{
  let a = req.body.a;
  let b = req.body.b;
  if(typeof a!=='number'||typeof b!=='number') {
    return res.status(400).json({error: "Inputs must be of type number!"});
  }

  mathService.multiply(a, b)
  .then((result)=>{
    res.json({result: result.result});
  })
  .catch((err)=>{
    res.status(500).json({error: err+""});
  })
});

router.post('/divide', (req, res)=>{
  let a = req.body.a;
  let b = req.body.b;
  if(typeof a!=='number'||typeof b!=='number') {
    return res.status(400).json({error: "Inputs must be of type number!"});
  }

  mathService.divide(a, b)
  .then((result)=>{
    res.json({result: result.result});
  })
  .catch((err)=>{
    res.status(500).json({error: err+""});
  })
});

router.post('/add', (req, res)=>{
  let a = req.body.a;
  let b = req.body.b;
  if(typeof a!=='number'||typeof b!=='number') {
    return res.status(400).json({error: "Inputs must be of type number!"});
  }

  mathService.add(a, b)
  .then((result)=>{
    res.json({result: result.result});
  })
  .catch((err)=>{
    res.status(500).json({error: err+""});
  })
});

router.post('/subtract', (req, res)=>{
  let a = req.body.a;
  let b = req.body.b;
  if(typeof a!=='number'||typeof b!=='number') {
    return res.status(400).json({error: "Inputs must be of type number!"});
  }

  mathService.subtract(a, b)
  .then((result)=>{
    res.json({result: result.result});
  })
  .catch((err)=>{
    res.status(500).json({error: err+""});
  })
});

router.post('/pow', (req, res)=>{
  let a = req.body.a;
  let b = req.body.b;
  if(typeof a!=='number'||typeof b!=='number') {
    return res.status(400).json({error: "Inputs must be of type number!"});
  }

  mathService.pow(a, b)
  .then((result)=>{
    res.json({result: result.result});
  })
  .catch((err)=>{
    res.status(500).json({error: err+""});
  })
});


module.exports = router;