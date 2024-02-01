const nodemailer = require('nodemailer');

// Create a transporter with your SMTP settings
const transporter = nodemailer.createTransport({
  host: 'mrhands.tarhelyingyen.hu',
  port: 587,
  secure: false,
  auth: {
    user: 'test@mrhands.tarhelyingyen.hu',
    pass: ''
  }
});

// Email content
const mailOptions = {
  from: 'test@mrhands.tarhelyingyen.hu',
  to: 'gyurus.bence@gmail.com',
  subject: 'Subject of the email',
  text: 'Hello, this is the body of the email.'
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending email:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});
