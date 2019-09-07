
/**
 *
 * @param {string} names user name
 * @returns {string} message
 */
export const userMessage = names => (`
Welcome ${names}.
Please confirm your email to proceed.
`);
/**
 *
 * @param {string} names
 * @param {string} password
 * @param {string} email
 * @returns {string} message
 */
export const busOperatorMessage = ({ name, password, email }) => (`
Welcome ${name}!!!.
Your login credentials is as follow:
email: ${email},
password: ${password}. 
You are required to reset your password.
`);
