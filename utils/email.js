// utils/email.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    family: 4, // Force IPv4
});

const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendVerificationEmail = async (email, verificationCode, firstName) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Votre code de vérification EduHive",
        text: `Votre code de vérification est : ${verificationCode}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Bonjour ${firstName},</h2>
        <p>Votre code de vérification est :</p>
        <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px; text-align: center;">
          ${verificationCode}
        </h1>
        <p>Ce code expire dans 10 minutes.</p>
        <p style="color: #666; font-size: 12px;">
          Si vous n'avez pas demandé ce code, ignorez cet email.
        </p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Email envoyé avec succès à:", email);
    } catch (error) {
        console.error("❌ Erreur lors de l'envoi de l'email:", error);
        throw new Error(`Échec de l'envoi de l'email : ${error.message}`);
    }
};

// Test de connexion SMTP (optionnel, à supprimer après test)
const testEmailConnection = async () => {
    try {
        await transporter.verify();
        console.log("✅ Serveur SMTP prêt à envoyer des emails");
    } catch (error) {
        console.error("❌ Erreur de connexion SMTP:", error);
    }
};

module.exports = { 
    sendVerificationEmail, 
    generateVerificationCode,
    testEmailConnection 
};