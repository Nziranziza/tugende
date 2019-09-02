import Joi from 'joi';

// eslint-disable-next-line import/prefer-default-export
export const createUser = Joi.object()
  .keys({
    email: Joi.string()
      .email()
      .required()
      .trim(),
    phoneNumber: Joi.string()
      .required()
      .min(10),
    username: Joi.string()
      .required()
      .trim(),
    password: Joi.string()
      .min(6)
      .required(),
  });

export const loginBody = Joi.object()
  .keys({
    username: Joi.string().required()
      .trim(),
    password: Joi.string().min(6).required(),
  });

export const createTicketBody = Joi.object()
  .keys({
    destination: Joi.string().required(),
    agency: Joi.string().required(),
    fare: Joi.number().required(),
    date: Joi.date().required(),
    passenger: Joi.string().required(),
    origin: Joi.string().required(),
  });

export const updateTicketBody = Joi.object()
  .keys({
    destination: Joi.string(),
    agency: Joi.string(),
    fare: Joi.number(),
    date: Joi.date(),
    passenger: Joi.string(),
    origin: Joi.string(),
  });

export const addAgencyBody = Joi.object()
  .keys({
    name: Joi.string().required(),
    location: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    email: Joi.string().email().required(),
  });
