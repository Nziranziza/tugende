import bcrypt from 'bcrypt';
import Joi from 'joi';
import { userCollection } from '../collections';
import { resetDefaultPasswordBody } from '../inputValidation';
/**
 * reset password for firstLogin
 * for agency userType
 */
export const resetDefaultPassword = async function () {
  const { body } = this.request;
  this.response.setHeader('Content-Type', 'application/json');
  const { error } = Joi.validate({ ...body }, resetDefaultPasswordBody);
  if (error) {
    this.response.writeHead(400);
    this.response.end(JSON.stringify({
      message: 'Bad request',
      error,
    }));
    return;
  }
  const { oldPassword, username, newPassword } = body;
  const user = userCollection.findOne(
    {
      $or: [{ email: username },
        { phoneNumber: username },
        { password: oldPassword },
        { username }],
    },
  );
  if (!user) {
    this.response.writeHead(404);
    this.response.end(JSON.stringify({
      message: 'user not found',
    }));
    return;
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  userCollection.update({ _id: user._id }, {
    $set: {
      firstLogin: false,
      password: hashedPassword,
      updatedAt: new Date(),
    },
  });
  this.response.writeHead(200);
  this.response.end(JSON.stringify({
    message: 'Password reset successfully!!!',
  }));
};
