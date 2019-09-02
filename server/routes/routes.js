import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';
import {
  getUsers,
  getUser,
  postUser,
  login,
} from '../controllers/userController';
import {
  createTicket,
  deleteTicket,
  getTicket,
  updateTicket,
  getAllTickets,
} from '../controllers/ticketController';

if (Meteor.isServer) {
  Router.route('/users', { where: 'server' })
    .get(getUsers)
    .post(postUser);

  Router.route('/users/:id', { where: 'server' })
    .get(getUser);

  Router.route('/users/login', { where: 'server' })
    .post(login);

  Router.route('/tickets', { where: 'server' })
    .post(createTicket)
    .get(getAllTickets);

  Router.route('/tickets/:id', { where: 'server' })
    .get(getTicket)
    .put(updateTicket)
    .delete(deleteTicket);
}
