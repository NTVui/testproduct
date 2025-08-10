const nodemailer = require("nodemailer");

module.exports.sendMail = async (email, subject, html) => {
  
    // initialize and define the mode of transport
    const transporter = nodemailer.createTransport({
      //host: process.env.HOST,
      service: "gmail",
      //port: Number(process.env.EMAIL_PORT),
      //secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.EMAIL_USER,
        //Vào mật khẩu ứng dụng của gmail
        //Tạo và nó sẽ cho pass
        pass: process.env.EMAIL_PASS,
      },
    });

    // Defining the mail and sending it using the transport
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: html,
    };
    transporter.sendMail(mailOptions, function(error, info){
        try {
            
            console.log(info.response)
        } catch (error) {
            console.log(error.message);
        }
    })
    
};

