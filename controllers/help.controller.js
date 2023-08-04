const nodemailer = require("nodemailer");
const { ctrlWrapper, HttpError } = require("../helpers");

const config = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: process.env.UKRNET_EMAIL,
    pass: process.env.UKRNET_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

const sendEmail = async (req, res) => {
  const { email, comment } = req.body;

  const userEmail = {
    from: process.env.UKRNET_EMAIL,
    to: email,
    subject: "Help TaskPro",
    text: comment,
    html: `<p>We have recieved your help request. Thanks for your comment. Our client service will connect you as soon as possible.</p><div>Best regards, TaskPro Client Service</div>`,
  };

  await transporter.sendMail(userEmail, (error, info) => {
    if (error) {
      throw HttpError(400, `Email error: ${error.message}`);
    }
  });
  res.status(200).json({ message: "Message sent successfully" });
};

module.exports = {
  sendEmail: ctrlWrapper(sendEmail),
};
