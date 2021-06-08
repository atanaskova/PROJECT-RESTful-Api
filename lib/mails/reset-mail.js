const nodemailer=require("nodemailer");
const events=require('events');
const emitter=new events.EventEmitter();
require('dotenv').config();

module.exports=()=>{
    const transporter=nodemailer.createTransport({
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

    const reset=async()=>{
        await transporter.sendMail({
            from:'ws-gen-11@outlook.com',
            to: process.env.ETHEREAL_USER,
            subject:'Reset Password',
            text:'Hello there! Click on the link to reset your password: localhost:3003/api/v1/auth/reset-password'
        });
    }

    emitter
        .on('reset',data=>{
            reset();
            console.log('Check your email to change password!');
        })

        emitter.emit('reset')
}