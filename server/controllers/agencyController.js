import Joi from 'joi';
import { agencyCollection } from '../collections';
import { addAgencyBody } from '../inputValidation';

/**
 * @author Daniel
 */
export const addAgency = function () {
  const { body } = this.request;
  const { error } = Joi.validate(body, addAgencyBody);
  console.log(error);
};

/**
 * @author Daniel
 */
export const getAllAgencies = function () {

};
