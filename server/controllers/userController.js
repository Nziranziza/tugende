import Joi from 'joi';
import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';
import { userCollection, tokenCollection } from '../collections';
import { createUser, loginBody, updateUserBody } from '../inputValidation';
import jwtTokenSigner from '../helpers/jwtTokenSigner';
import emailService from '../helpers/emailServices';
import { userMessage } from '../helpers/welcomeMessages';

const { SECURITY_KEY } = process.env;

/**
 * @author Daniel
 * @description Get all users that exist in the database
 *              accessible by admin only
 * @returns an array of user object
 */
export const getUsers = function() {
  this.response.setHeader('Content-Type', 'application/json');
  const { authorization } = this.request.headers;
  try {
    const { userType } = Jwt.verify(authorization, SECURITY_KEY);
    if (userType !== 'admin') {
      this.response.writeHead(401);
      this.response.end(JSON.stringify({
        message: 'not authorized',
      }));
      return;
    }
    const users = userCollection.find();
    this.response.end(JSON.stringify({
      size: users.count(),
      users: users.fetch(),
    }));
  } catch (error) {
    this.response.writeHead(401);
    this.response.end(JSON.stringify({
      message: 'not authorized',
    }));
  }
};

/**
 * @author Daniel
 * @description Get a single by a given id
 *              accessible by admin only
 * @returns user object
 */
export const getUser = function() {
  this.response.setHeader('Content-type', 'application/json');
  const { id } = this.params;
  const { authorization } = this.request.headers;
  const { _id, userType } = Jwt.verify(authorization, SECURITY_KEY);
  if (userType !== 'admin' && id !== _id) {
    this.response.writeHead(401);
    this.response.end(JSON.stringify({
      message: 'not authorized',
    }));
    return;
  }
  const user = userCollection.findOne({ _id: id });
  if (!user) {
    this.response.writeHead(404);
    this.response.end(JSON.stringify({
      message: 'user not found',
    }));
    return;
  }
  this.response.writeHead(200);
  this.response.end(JSON.stringify(user));
};

/**
 * @author Daniel
 * @description Add a new user
 *              accessible by everyone
 * @returns user object with a token
 */
export const postUser = async function() {
  const { body } = this.request;
  this.response.setHeader('Content-Type', 'application/json');
  try {
    const { error } = Joi.validate({ ...body }, createUser);
    if (error) {
      this.response.writeHead(400);
      this.response.end(JSON.stringify(error));
      return;
    }
    const {
      email,
      username,
      phoneNumber,
      password,
    } = body;
    const user = userCollection.findOne({ $or: [{ email }, { phoneNumber }, { username }] });
    if (user) {
      this.response.writeHead(409);
      this.response.end(JSON.stringify({
        status: 409,
        message: 'user already exist',
      }));
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newId = userCollection.insert({
      email,
      username,
      phoneNumber,
      password: hashedPassword,
      userType: 'user',
      active: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const newUser = userCollection.findOne({ _id: newId });
    const token = jwtTokenSigner(newUser);
    tokenCollection.insert({
      userId: newUser._id,
      token,
      createdAt: new Date(),
      status: 'valid',
    });
    emailService(userMessage(username), email, 'Verify your email');
    this.response.writeHead(201);
    this.response.end(JSON.stringify({
      message: 'Account created. Please verify your email!',
      user: newUser,
      token,
    }));
    return;
  } catch (err) {
    this.response.end(JSON.stringify({
      message: 'something went wrong',
      error: err,
    }));
  }
};

/**
 * @author Daniel
 * @description login a registered user
 *              accessible by everyone
 * @returns user object with token
 */
export const login = async function () {
  const { body } = this.request;
  this.response.setHeader('Content-Type', 'application/json');
  const { error } = Joi.validate({ ...body }, loginBody);
  if (error) {
    this.response.writeHead(400);
    this.response.end(JSON.stringify(error));
    return;
  }
  const { username, password } = body;
  const user = userCollection.findOne(
    {
      $or: [{ email: username },
        { phoneNumber: username },
        { username }],
    },
  );
  if (!user) {
    this.response.writeHead(404);
    this.response.end(JSON.stringify({
      message: 'password and email don\'t match',
    }));
    return;
  }
  if (user && user.firstLogin && user.password === password) {
    this.response.writeHead(200);
    this.response.end(JSON.stringify({
      message: 'Reset your password',
    }));
    return;
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    this.response.writeHead(404);
    this.response.end(JSON.stringify({
      message: 'password and email don\'t match',
    }));
  } else {
    const token = jwtTokenSigner(user);
    // eslint-disable-next-line no-shadow
    const { password, ...userData } = user;
    tokenCollection.insert({
      userId: user._id,
      token,
      createdAt: new Date(),
      status: 'valid',
    });
    this.response.writeHead(200);
    this.response.end(JSON.stringify({ user: userData, token }));
  }
};
/**
 * @author Daniel
 * @description update user profile
 *              accessible by loggedIn user and admin
 */
export const updateUser = async function () {
  const { body } = this.request;
  const { id } = this.params;
  this.response.setHeader('Content-Type', 'application/json');
  try {
    const { authorization } = this.request.headers;
    const { userId, userType } = Jwt.verify(authorization, SECURITY_KEY);
    if (userType !== 'admin' && id !== userId) {
      this.response.writeHead(401);
      this.response.end(JSON.stringify({
        message: 'not authorized',
      }));
      return;
    }
    const user = userCollection.findOne({ _id: id });
    if (!user) {
      this.response.writeHead(404);
      this.response.end(JSON.stringify({
        message: 'user not found',
      }));
      return;
    }
    const { error } = Joi.validate({ ...body }, updateUserBody);
    if (error) {
      this.response.writeHead(400);
      this.response.end(JSON.stringify(error));
      return;
    }
    userCollection.update({ _id: id }, { $set: { ...body, updatedAt: new Date() } });
    const { password, ...updatedUser } = userCollection.findOne({ _id: user._id });
    this.response.writeHead(200);
    this.response.end(JSON.stringify({
      message: 'user updated',
      user: updatedUser,
    }));
  } catch (error) {
    this.response.writeHead(401);
    this.response.end(JSON.stringify({
      message: 'not authorized',
    }));
  }
};
