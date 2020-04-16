const nodemailer = require("nodemailer");

let transport = nodemailer.createTransport({
    service:"Gmail",
    auth:{
        user:"thdguswn989@gmail.com",
        pass:process.env.NODEMAIL_PASSWORD
    }
})

module.exports = transport