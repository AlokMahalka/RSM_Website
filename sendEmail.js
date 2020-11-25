const sgMail = require("@sendgrid/mail");
sgMail.setApiKey();
// 
const sendEmail = (to, from, subject, text) => {
  const msg = {
    to,
    from,
    subject,
    html: text,
  };

  sgMail.send(msg, function (err, result) {
    if (err) {
      console.log("Email Not Sent Error Occured");
    } else {
      console.log(`Email was sent to ${msg.to}`);
    }
  });
};

module.exports = sendEmail;