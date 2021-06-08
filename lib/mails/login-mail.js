const nodemailer=require("nodemailer");
const events=require('events');
const emitter=new events.EventEmitter();
const cron=require('node-cron');
const reminder=require('../jobs/cron');
require('dotenv').config();

module.exports=()=>{

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        tls: {
            rejectUnauthorized: false
          },
        auth: {
            user: process.env.ETHEREAL_USER,
            pass: process.env.ETHEREAL_PASS
        }
    });


   const login=async()=>{
    await transporter.sendMail({
        from:'ws-gen-11@outlook.com',
        to: process.env.ETHEREAL_USER,
        subject:'Welcome Back!',
        text:'Hello there! You have successfully logged in to our page!',
        html: {path:'./lib/mails/login.html'}
    });

    cron.schedule('*/10 * * * *',()=>{
        console.log(`Friendly reminder: ${reminder()}`);
    })
   }

    emitter
        .on('login',data=>{
            login();
            console.log('Message sent!');
        })

        emitter.emit('login')
}
