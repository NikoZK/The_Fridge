import nodemailer from 'nodemailer'
const testAccount = await nodemailer.createTestAccount()

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: testAccount.user,
    pass: testAccount.pass
  }
})

export async function sendWelcomeEmail (email, username) {
  const info = await transporter.sendMail({
    from: 'noreply@the-fridge.com',
    to: `${email}`,
    subject: 'Welcome to The Fridge!',
    text:
        `
        Welcome ${username}!
        Hello and welcome to THE FRIDGE
        `,
    html:
        `
        <h1>Welcome ${username}!</h1>

        <h2>Hello and welcome to THE FRIDGE</h2>
        
        `
  })

  const previewUrl = nodemailer.getTestMessageUrl(info)
  return previewUrl
}