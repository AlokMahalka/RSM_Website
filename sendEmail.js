const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API);
// 
//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
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