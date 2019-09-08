import Joi from 'joi';
import Jwt from 'jsonwebtoken';
import { Random } from 'meteor/random';
import { userCollection } from '../collections';
import { addAgencyBody } from '../inputValidation';
import { busOperatorMessage } from '../helpers/welcomeMessages';
import emailService from '../helpers/emailServices';

const { SECURITY_KEY } = process.env;

/**
 * @author Daniel
 *         add a new agency
 *         accessible by admin
 * @returns new agency
 */
export const addAgency = function () {
  this.response.setHeader('Content-Type', 'application/json');
  const { body } = this.request;
  const { email, phoneNumber } = body;
  const { authorization } = this.request.headers;
  const { error } = Joi.validate(body, addAgencyBody);
  if (error) {
    this.response.writeHead(400);
    this.response.end(JSON.stringify(error));
    return;
  }
  try {
    const { userType } = Jwt.verify(authorization, SECURITY_KEY);
    if (userType !== 'admin') {
      this.response.writeHead(401);
      this.response.end(JSON.stringify({
        message: 'not authorized',
      }));
      return;
    }
    const agency = userCollection.findOne({ $or: [{ email }, { phoneNumber }] });
    if (agency) {
      this.response.writeHead(400);
      this.response.end(JSON.stringify({
        message: 'agency already exist',
      }));
      return;
    }
    const { userId } = Jwt.verify(authorization, SECURITY_KEY);
    const newAgencyId = userCollection.insert({
      ...body,
      createdBy: userId,
      password: Random.id(),
      userType: 'agency',
      firstLogin: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const newAgency = userCollection.findOne({ _id: newAgencyId });
    emailService(
      busOperatorMessage(newAgency),
      newAgency.email,
      'Welcome and Reset your Password!',
    );
    this.response.writeHead(201);
    this.response.end(JSON.stringify({
      message: 'agency added successfully',
      agency: newAgency,
    }));
  } catch (err) {
    this.response.writeHead(401);
    this.response.end(JSON.stringify({
      message: 'not authorized',
    }));
  }
};

/**
 * @author Daniel
 *         get all agencies
 *         accessible by everyone
 * @returns array of agencies
 */
export const getAllAgencies = function () {
  this.response.setHeader('Content-Type', 'application/json');
  try {
    const agencies = userCollection.find({ userType: 'agency' });
    this.response.end(JSON.stringify({
      size: agencies.count(),
      agencies: agencies.fetch(),
    }));
    return;
  } catch (error) {
    this.response.writeHead(500);
    this.response.end(JSON.stringify({
      message: error.message,
    }));
  }
};
