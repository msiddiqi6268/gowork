import nodemailer from 'nodemailer'
import ejs from 'ejs'
export const send_offer_email = async (user) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // use a service that allows you to send emails (e.g. Gmail, Outlook, etc.)
        auth: {
            user: process.env.SENDER_MAIL, // your email address
            pass: process.env.MAIL_PSWD // your email password
        }
    });
    const {email,username,id}= user
    ejs.renderFile("views/Email_Templates/OfferEmail.ejs", { username: username,
    logo:`${process.env.SERVER_URL}/emails/logo.png`
    }, function (err, data) {
            var mainOptions = {
                from: process.env.SENDER_MAIL,
                to: email,
                subject: 'GoWork: You got an offer!',
                html: data
            };
            transporter.sendMail(mainOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Message sent: ' + info.response);
                }
            });
        });
}