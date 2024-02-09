const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send(req.headers);
  console.log(req.socket.remoteAddress);
  console.log(req);
})

app.listen(8080, () => {
  console.log(`Example app listening on port`)
})