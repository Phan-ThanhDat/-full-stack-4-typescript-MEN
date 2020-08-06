import nodemailer from 'nodemailer'

type OptionsType = {
  email: string;
  subject: string;
  message: string;
}

const sendEmail = async (options: OptionsType) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL, // generated ethereal user
      pass: process.env.SMTP_PASSWORD, // generated ethereal password
    },
  })

  const info = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
  }

  await transporter.sendMail(info)
}

module.exports = sendEmail
