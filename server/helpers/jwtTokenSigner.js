import Jwt from 'jsonwebtoken';

const { SECURITY_KEY } = process.env;

/**
 * @author Daniel
 * @param {object} user
 * @return {string} jwt token
 */
const jwtTokenSigner = user => Jwt.sign({
  userId: user._id,
  userType: user.userType,
}, SECURITY_KEY);

export default jwtTokenSigner;
