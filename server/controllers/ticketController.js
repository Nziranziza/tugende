import Joi from 'joi';
import Jwt from 'jsonwebtoken';
import { ticketCollection, tokenCollection } from '../collections';
import { createTicketBody, updateTicketBody } from '../inputValidation';

const { SECURITY_KEY } = process.env;

/**
 * @author Daniel
 * @description create a ticket
 *              accessible by registered user only
 * @returns ticket object
 */
export const createTicket = function () {
  const { body } = this.request;
  this.response.setHeader('Content-Type', 'application/json');
  const { authorization } = this.request.headers;
  if (!authorization) {
    this.response.writeHead(401);
    this.response.end(JSON.stringify({
      message: 'not authorized',
    }));
    return;
  }
  try {
    const { userId } = Jwt.verify(authorization, SECURITY_KEY);
    const token = tokenCollection.findOne({ $and: [{ userId }, { token: authorization }] });
    if (!token) {
      this.response.writeHead(401);
      this.response.end(JSON.stringify({
        message: 'invalid token',
      }));
      return;
    }
    const { error } = Joi.validate(body, createTicketBody);
    if (error) {
      this.response.writeHead(400);
      this.response.end(JSON.stringify(error));
      return;
    }
    const newTicketId = ticketCollection.insert({
      ...body,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const ticket = ticketCollection.findOne({ _id: newTicketId });
    this.response.writeHead(201);
    this.response.end(JSON.stringify(ticket));
  } catch (error) {
    this.response.writeHead(401);
    this.response.end(JSON.stringify({
      message: 'invalid token',
    }));
  }
};

/**
 * @author Daniel
 * @description get a single ticket
 *              accessible by owner of ticket and admin
 * @returns ticket object
 */
export const getTicket = function () {
  const { id } = this.params;
  this.response.setHeader('Content-Type', 'application/json');
  const { authorization } = this.request.headers;
  if (!authorization) {
    this.response.writeHead(401);
    this.response.end(JSON.stringify({
      message: 'not authorized',
    }));
    return;
  }
  try {
    const { userId } = Jwt.verify(authorization, SECURITY_KEY);
    const token = tokenCollection.findOne({ $and: [{ userId }, { token: authorization }] });
    if (!token) {
      this.response.writeHead(401);
      this.response.end(JSON.stringify({
        message: 'invalid token',
      }));
      return;
    }
    const ticket = ticketCollection.findOne({ $and: [{ _id: id }, { userId }] });
    if (!ticket) {
      this.response.writeHead(404);
      this.response.end(JSON.stringify({
        message: 'ticket not found',
      }));
      return;
    }
    this.response.writeHead(200);
    this.response.end(JSON.stringify(ticket));
  } catch (error) {
    this.response.writeHead(401);
    this.response.end(JSON.stringify({
      message: 'invalid token',
    }));
  }
};

/**
 * @author Daniel
 * @description delete a ticket order
 *              accessible by the owner of ticket
 * @returns delete ticket;
 */
export const deleteTicket = function () {
  const { id } = this.params;
  this.response.setHeader('Content-Type', 'application/json');
  const { authorization } = this.request.headers;
  if (!authorization) {
    this.response.writeHead(401);
    this.response.end(JSON.stringify({
      message: 'not authorized',
    }));
    return;
  }
  try {
    let ticket;
    const { userId, userType } = Jwt.verify(authorization, SECURITY_KEY);
    if (userType === 'admin') {
      ticket = ticketCollection.findOne({ _id: id });
    } else {
      ticket = ticketCollection.findOne({ $and: [{ _id: id }, { userId }] });
    }
    if (!ticket) {
      this.response.writeHead(404);
      this.response.end(JSON.stringify({
        message: 'ticket not found',
      }));
      return;
    }
    ticketCollection.remove({ _id: id }, { justOne: true });
    this.response.writeHead(200);
    this.response.end(JSON.stringify({
      message: 'ticket deleted',
      ticket,
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
 * @description update ticket
 *              accessible by owner of ticket and admin
 * @returns ticket object
 */
export const updateTicket = function () {
  const { id } = this.params;
  const { body } = this.request;
  this.response.setHeader('Content-Type', 'application/json');
  const { authorization } = this.request.headers;
  if (!authorization) {
    this.response.writeHead(401);
    this.response.end(JSON.stringify({
      message: 'not authorized',
    }));
    return;
  }
  try {
    let ticket;
    const { userId, userType } = Jwt.verify(authorization, SECURITY_KEY);
    if (userType === 'admin') {
      ticket = ticketCollection.findOne({ _id: id });
    } else {
      ticket = ticketCollection.findOne({ $and: [{ _id: id }, { userId }] });
    }
    if (!ticket) {
      this.response.writeHead(404);
      this.response.end(JSON.stringify({
        message: 'ticket not found',
      }));
      return;
    }
    const { error } = Joi.validate(body, updateTicketBody);
    if (error) {
      this.response.writeHead(400);
      this.response.end(JSON.stringify(error));
      return;
    }
    ticketCollection.update({ _id: id }, { $set: { ...body, updatedAt: new Date() } });
    const updatedTicket = ticketCollection.findOne({ _id: ticket._id });
    this.response.writeHead(200);
    this.response.end(JSON.stringify({
      message: 'ticket updated',
      ticket: updatedTicket,
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
 * @description get users tickets
 *              admin and owner
 * @returns array of tickets
 */
export const getAllTickets = function () {
  this.response.setHeader('Content-Type', 'application/json');
  const { authorization } = this.request.headers;
  if (!authorization) {
    this.response.writeHead(401);
    this.response.end(JSON.stringify({
      message: 'not authorized',
    }));
    return;
  }
  try {
    let tickets;
    const { userId, userType } = Jwt.verify(authorization, SECURITY_KEY);
    if (userType === 'admin') {
      tickets = ticketCollection.find();
    } else {
      tickets = ticketCollection.find({ userId });
    }
    this.response.writeHead(200);
    this.response.end(JSON.stringify({
      size: tickets.count(),
      tickets: tickets.fetch(),
    }));
    return;
  } catch (error) {
    this.response.writeHead(401);
    this.response.end(JSON.stringify({
      message: 'not authorized',
    }));
  }
};
