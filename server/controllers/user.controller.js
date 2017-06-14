'use strict';

const User = require('../../config/db').User;
const Profile = require('../../config/db').Profile;
<<<<<<< 8765f6d0eac87c49482b146db48550708447fc33
const Guest = require('../../config/db').Guest;
const password = require('./../helper/passwordGenerator');

module.exports = {
  create(req, res) {
    let assignUser = Object.assign({}, req.body);
    const eventId = req.body.eventId;
    eventId ?
      req.body.emails.map(email => {
        User.findOrCreate({
          where: {
            email: email
          },
          defaults: {
            email: email,
            password: password.passwordGenerate(),
            is_invited: true
          }
        })
        .spread((user, created) => {
          Guest.findOne({
            where: {
              user_id: user.id
            }
          })
          .then(guest => {!guest &&
            Guest.create({
              event_id: eventId,
              user_id: user.id
            });
          });
          res.status(201).send(user);
        })
        .catch(error => res.status(400).send(error));
      }) :
      User.create(assignUser)
        .then(user => res.status(201).send(user))
        .catch(error => res.status(400).send(error));
  },
  retrieve(req, res) {
    User.findById(req.params.id)
    .then(user => {
      if (!user) {
        return res.status(404).send(message.userError);
      }
      Profile.findById(user.profile_id).then(profile => {
        if (!profile) {
          return res.status(404).send(message.profileError);
        }

        const data = Object.assign({}, {email: user.email,
          firstName: profile.first_name,
          lastName: profile.last_name,
          avatar: profile.avatar,
          birthdate: profile.birth_date,
          address: profile.address,
          city: profile.city,
          country: profile.city
        });
        return res.status(200).send(data);
      })
      .catch(error => {
        return res.status(400).send(error);
      });
    })
    .catch(error => {
      return res.status(400).send(error);
    });
  },
  destroy(req, res) {
    User.findById(req.params.id)
    .then(user => {
      if (!user) {
        return res.status(404).send(message.userNotFound);
      }
      return user
      .destroy()
      .then(user => res.status(204).send(user))
      .catch(error => res.status(404).send(error));
    })
    .catch(error => res.status(404).send(error));
  }
};
