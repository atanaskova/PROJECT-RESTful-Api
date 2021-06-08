const nodemailer=require("nodemailer");
const events=require('events');
const emitter=new events.EventEmitter();

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

   const newBlogPost=async()=>{

    await transporter.sendMail({
        from:'ws-gen-11@outlook.com',
        to:'lynn39@ethereal.email',
        subject:'Congratulations!',
        text:'Hello there! You have successfully created a blog post!',
        html: {path:'./lib/mails/new-blog-post.html'}
    });
   }

    emitter
        .on('blogpost_created',data=>{
            newBlogPost();
            console.log('Message sent!');
        })

        emitter.emit('blogpost_created')
}
