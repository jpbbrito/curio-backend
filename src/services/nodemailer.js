import nodemailer from 'nodemailer'

const config = {
  host: process.env.NM_HOST,
  port: parseInt(process.env.NM_PORT),
  auth: {
    user: process.env.NM_USER,
    pass: process.env.NM_PASS
  }
}
console.log('[nodemailer.js]', config)

export default nodemailer.createTransport(config)
