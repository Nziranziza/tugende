import Joi from 'joi';
import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';
import { userCollection, tokenCollection } from '../collections';
import { createUser, loginBody } from '../inputValidation';
import jwtTokenSigner from '../helpers/jwtTokenSigner';

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
  const { error } = Joi.validate({ ...body }, createUser);
  this.response.setHeader('Content-Type', 'application/json');
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
    this.response.writeHead(404);
    this.response.end(JSON.stringify({
      status: 404,
      message: 'email already exist',
      user,
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
  this.response.writeHead(201);
  const newUser = userCollection.findOne({ _id: newId });
  const token = jwtTokenSigner(newUser);
  tokenCollection.insert({
    userId: newUser._id,
    token,
    createdAt: new Date(),
    status: 'valid',
  });
  this.response.end(JSON.stringify({ user: newUser, token }));
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
