const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const nodemailer = require('nodemailer');
const validator = require('validator');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 


// Servera statiska filer från din portfolio-mapp
app.use(express.static(path.join(__dirname, '..', 'portfolio')));

/*Startsidans endpoint */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'portfolio', 'portfolio.html'));
});


app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});


/*Kontakt formulärets endpoint för console.log 
const multer = require('multer');
const upload = multer();

app.post('/contact', upload.none(), (req, res) => {
  console.log('BODY:', req.body);
  const { name, email, message, subject } = req.body;
  console.log('Kontaktmeddelande:', { name, email, message, subject });
  res.send('Your data has been sent succefully');
});*/
















/*Kontakt formulärets endpoint för att skicka email med nodemailer och Gmail*/
 // Skapa transporter för Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,      
      pass: process.env.GMAIL_PASS
    }
  });
  
app.post('/contact', async (req, res) => {
  let { name, email, subject, message } = req.body;

  name = validator.escape(name || '');
  email = validator.normalizeEmail(email || '');
  subject = validator.escape(subject || '');
  message = validator.escape(message || '');


  if (!name || !email || !message || !subject) {
    return res.status(400).send('Vänligen fyll i alla obligatoriska fält.');
  }

  // Skapa e-postmeddelandet
  const mailOptions = {
    from: `"Kontaktformulär" <${process.env.GMAIL_USER}>`, // för att slippa spofing
    to: process.env.GMAIL_USER,
    replyTo: email, // gör så att man kan klicka "Svara" i inkorgen
    subject: subject || 'Kontaktformulär',
    text: `Namn: ${name}\nE-post: ${email}\n\nMeddelande:\n${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send('Tack! Ditt meddelande har skickats.');
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).send('Kunde inte skicka meddelandet.');
  }
});


const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minut
  max: 5 // max 10 requests per minut
});
app.use(limiter);


app.get('/underconst', (req, res) => {
  const theme = req.query.theme;
  if (theme === 'dark') {
    res.sendFile(path.join(__dirname, '..', 'portfolio', 'underconstdark.html'));
  } else {
    res.sendFile(path.join(__dirname, '..', 'portfolio', 'underconst.html'));
  }
});