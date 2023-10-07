const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send(req.headers);
  console.log(req.socket.remoteAddress)
})

app.listen(8080, () => {
  console.log(`Example app listening on port`)
})