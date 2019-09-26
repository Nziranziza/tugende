import Joi from 'joi';
import Jwt from 'jsonwebtoken';
import { addBusBody } from '../inputValidation';
import { busCollection } from '../collections';

const { SECURITY_KEY } = process.env;

/**
 * @author Daniel
 *         accessible by agency
 * @retuns a bus object
 */
export const addBus = function() {
  this.response.setHeader('Content-Type', 'application/json');
  const { body } = this.request;
  const { authorization } = this.request.headers;
  const { error } = Joi.validate(body, addBusBody);
  if (!authorization) {
    this.response.writeHead(401);
    this.response.end(JSON.stringify({
      message: 'not authorized',
    }));
    return;
  }
  if (error) {
    this.response.writeHead(400);
    this.response.end(JSON.stringify(error));
    return;
  }
  try {
    const { userId, userType } = Jwt.verify(authorization, SECURITY_KEY);
    if (userType !== 'agency') {
      this.response.writeHead(401);
      this.response.end(JSON.stringify({
        message: 'not authorized',
      }));
      return;
    }
    const newBusId = busCollection.insert({
      ...body,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const newBus = busCollection.findOne({ _id: newBusId });
    this.response.writeHead(201);
    this.response.end(JSON.stringify({
      message: 'bus added successfully',
      bus: newBus,
    }));
  } catch (err) {
    this.response.writeHead(500);
    this.response.end(
      JSON.stringify({
        message: 'something went wrong',
      }),
    );
  }
};

// eslint-disable-next-line require-jsdoc
export const dummyfunc = function() {};
