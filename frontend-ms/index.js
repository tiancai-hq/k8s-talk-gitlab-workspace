const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const CONFIG = require('./config');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use("/api/v1", require('./api'));
app.get(/^\/[a-z]*$/, (req, res)=>{
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})
app.use("/", express.static(path.join(__dirname, 'public')))


app.use((req, res, next) => {
  res.status(404).json({error: "Not Found"});
})

app.listen(CONFIG.PORT, ()=>{
  console.log("Server started on port "+CONFIG.PORT);
});