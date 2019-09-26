import { Meteor } from 'meteor/meteor';

export const userCollection = new Meteor.Collection('users');
export const tokenCollection = new Meteor.Collection('token');
export const ticketCollection = new Meteor.Collection('tickets');
export const busCollection = new Meteor.Collection('buses');
