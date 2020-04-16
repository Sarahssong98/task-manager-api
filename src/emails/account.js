const sgMail= require('@sendgrid/mail')
//email 

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email,name)=>{
    sgMail.send({
        to:email,
        from:'thdguswn989@gmail.com',
        subject:'Welcome to the App!',
        text: `Welcome to the App, ${name}. Let me know how you get along with the app`
    }).then(() => {}, error => {
        console.error(error);
     
        if (error.response) {
          console.error(error.response.body)
        }
    });
}
//export various objects
module.exports = {
    sendWelcomeEmail
}