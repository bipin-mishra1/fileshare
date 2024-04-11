const nodemailer = require('nodemailer')

const sendMail = async ({from, to, subject, text, html})=>{
   let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secrue: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWD
    }
   });

   let info = await transporter.sendMail({
    from: from, 
    to: to, 
    subject: subject, 
    text: text,
    html: html,
}).catch(err=>{
    console.log(err)
})

console.log(info)

}

module.exports = sendMail;