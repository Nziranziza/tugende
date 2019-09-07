import { Email } from 'meteor/email';

const { EMAIL_SENDER } = process.env;
export default (message, to, subject) => {
  Email.send({
    to,
    from: EMAIL_SENDER,
    subject,
    text: message,
  });
};
