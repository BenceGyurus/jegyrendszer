
const nodemailer = require('nodemailer');
 
 
let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '	agora.mail.service@gmail.com',
        pass: 'agorasavaria2023'
    }
});
 
let mailDetails = {
    from: '	agora.mail.service@gmail.com',
    to: 'gyurus.bence@gmail.com',
    subject: 'Test mail',
    text: 'Node.js testing mail for GeeksforGeeks'
};
 
mailTransporter.sendMail(mailDetails, function(err, data) {
    if(err) {
        console.log('Error Occurs', err);
    } else {
        console.log('Email sent successfully');
    }
});