const nodemailer=require("nodemailer");
const events=require('events');
const emitter=new events.EventEmitter();
// var hbs=require("nodemailer-handlebars");

module.exports=()=>{

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        tls: {
            rejectUnauthorized: false
          },
        auth: {
            user: 'lynn39@ethereal.email',
            pass: 'zKG79YsTqJYs9Z3jBN'
        }
    });

//     transporter.use('compile', hbs({
//         viewEngine: 'express-handlebars',
//         viewPath: '/index.handlebars.html'
//    }));

   const newBlogPost=async()=>{
    
//     let mailOptions={
//             from:'ws-gen-11@outlook.com',
//             to:'lynn39@ethereal.email',
//             subject:'Congratulations!',
//             template:'email',
//             context:{
//                 name:'Ws-gen-11'
//             }
//         };
    
//     transporter.sendMail(mailOptions,(err,data)=>{
//         if(err){
//             console.log(`${err.message}`);
//         }
//         console.log('Email sent successfully!');
//     });
//    }

    await transporter.sendMail({
        from:'ws-gen-11@outlook.com',
        to:'lynn39@ethereal.email',
        subject:'Congratulations!',
        text:'Hello there! You have successfully created a blog post!',
        html: {path:'./lib/new-blog-post.html'}
    });
   }

    emitter
        .on('blogpost_created',data=>{
            newBlogPost();
            console.log('Message sent!');
        })

        emitter.emit('blogpost_created')
}
