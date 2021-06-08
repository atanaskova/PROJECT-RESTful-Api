const path=require('path');

module.exports=(blogPost,toEmail)=>{
    const filepath=path.join(__dirname,'../../pdfs/blogpost-${blogPost._id}.pdf');
    return{
        from:"test@test.com",
        to:'atanaskova.tm@yahoo.com',//toEmail
        subject:'Congratulations!',
        text:'Hello there! You have successfully created a new blog post!',
        html:`<h1>WS Gen 11</h1> <h3>Ws Gen 11</h3>`,
        attachment:filepath
    };
}
