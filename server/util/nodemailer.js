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
    from: 'football_summarizer@noreply.com',
    to: `${email}`,
    subject: 'Welcome to the site!',
    text:
        `
        Welcome ${username}!
        Happy to have you on board baby! (All data is stored and might be sold to Xi Jinping)
        `,
    html:
        `
        <h1>Welcome ${username}!</h1>

        <h2>Happy to have you on board baby! (All data is stored and might be sold to Xi Jinping)</h2>
        
        `
  })

  console.log('Message sent: %s', info.messageId)
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
}