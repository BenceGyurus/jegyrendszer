const axios = require('axios');
const fs = require('fs');

const pdfs = []

let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `http://localhost:5000/createCode`,
    headers: { 
        'Content-Type': 'application/json'
    },
    data : {
        "name": "Nagy Pöcsű",
        "seat": "Földszint jobb II.sor 1.szék",
        "title": "Csodálatos Előadás",
        "id": 10000008,
        "local": true,
        "email": "anyabence5@gmail.com",
        "email_body": "vegre gec",
        "location": "Agora Savaria",
        "start": "2023.08.01 17:00",
        "price": 21551
    },
    responseType: 'stream'
  };
axios.request(config)
    .then((response) => {
        const fileStream = fs.createWriteStream(`../data/email/asdasd.pdf`);
        response.data.pipe(fileStream);
        fileStream.on('finish', () => {
            console.log('File downloaded successfully');
        });
        fileStream.on('error', err => {
            console.error('Error saving file:', err.message);
        });        
    })
