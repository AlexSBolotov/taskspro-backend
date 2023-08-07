const nodemailer = require("nodemailer");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
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
  try {
    const emailTemplate = fs.readFileSync(
      path.join(__dirname, "emailTemplate.ejs"),
      "utf-8"
    );
    const renderedEmail = ejs.render(emailTemplate);
    const mailOptions = {
      from: "task-pro-help@ukr.net",
      to: email,
      subject: comment,
      html: renderedEmail,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    throw HttpError(400, `Email error: ${error.message}`);
  }
};

module.exports = {
  sendEmail: ctrlWrapper(sendEmail),
};
