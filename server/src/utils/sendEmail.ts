import dotenv from 'dotenv'
import sgMail from '@sendgrid/mail'

dotenv.config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? '')

function sendEmail(
  email: string,
  data: any,
  templateId: string,
) {
  const msg = {
    to: email,
    from: {
      email: 'no_reply@ygn.org.hk',
      name: 'youCodia'
    },
    templateId,
    dynamicTemplateData: data,
  }
  return sgMail.send(msg).catch((error: Error) => {
    throw new Error('EMAIL_SEND_ERROR: ' + error.message)
  })
}

export function sendVerificationEmail(
  email: string,
  name: string,
  origin: string,
  token: string,
) {
  const templateData = {
    email,
    name,
    origin: origin.replace(/['"\\]+/g, ''),
    token,
  }
  return sendEmail(email, templateData, 'd-e33023d2c8e2486686193d0f16f2e3c0')
}

export function sendPasswordResetEmail(
  email: string,
  name: string,
  origin: string,
  token: string,
) {
  const templateData = {
    email,
    name,
    origin: origin.replace(/['"\\]+/g, ''),
    token,
  }
  return sendEmail(email, templateData, 'd-c206cfee33904e1ba65b967362b3ae56')
}

export function sendAccountInviteEmail(
  emails: string[],
  sender: { name: string; email: string},
  origin: string,
){
  emails.forEach(email => {
    const templateData = {
      senderName: sender.name,
      senderEmail: sender.email,
      origin: origin.replace(/['"\\]+/g, ''),
    }
    // sendEmail(email, templateData, 'd-d598635d6a844c3fb3658220a145bb02' )
  })
}

export function sendCourseInviteEmail(
  emails: string[],
  sender: { name: string; email: string},
  courseName: string,
  courseCode: string,
  origin: string,
){
  emails.forEach(email => {
    const templateData = {
      senderName: sender.name,
      senderEmail: sender.email,
      origin: origin.replace(/['"\\]+/g, ''),
      courseName,
      courseCode
    }
    return sendEmail(email, templateData, 'd-d598635d6a844c3fb3658220a145bb02' )
  })
}
