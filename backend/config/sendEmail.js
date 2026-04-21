const nodemailer = require('nodemailer');

const sendEmailAlert = async (subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                // 🚀 Pulls from your .env for professional flexibility
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_APP_PASSWORD 
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            // 🚀 Sends to both accounts listed in your .env EMAIL_RECEIVERS
            to: process.env.EMAIL_RECEIVERS, 
            subject: subject,
            text: text
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Expert Alert Sent: ${subject}`);
    } catch (error) {
        console.error('❌ Email Alert Failed:', error.message);
    }
};

module.exports = sendEmailAlert;