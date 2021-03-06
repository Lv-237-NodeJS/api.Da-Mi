'use strict';

const { User, Profile, Gift, Event, Comment } = require('../../config/db');
const { mailer, templates, messages, constants } = require('./../helper');
const commentReply = require('../../config/mailerOptions.json').commentReply;

const avatarView = comment => {
  const {avatar} = comment.User.Profile.dataValues;
  comment.User.Profile.dataValues.avatar = (avatar !== null &&
    avatar.toString() || avatar);
};

const reply = comment => {
  let eventId;
  const {first_name: firstName, last_name: lastName} = comment.User.Profile || '';
  const route = `/events/${eventId}`;
  const data = Object.assign(commentReply, {
    host: constants.URL,
    route,
    firstName,
    lastName,
    email: comment.User.email,
    giftName: comment.Gift.dataValues.name,
  });
  mailer(data, templates.commentReply);
};

module.exports = {
  create(req, res) {
    const commentParams = Object.assign({}, req.body, {gift_id: req.params.gift_id},
      {eventId: req.params.id}, {user_id: req.decoded.id});
    const parentId = req.body.parent_id;
    !!parentId && (
      Comment.findById(parentId, {
        include: [{
          model: User,
          attributes: ['email'],
          include: [{
            model: Profile,
            attributes: ['first_name', 'last_name'],
          }],
        },{model: Gift}]
      })
      .then(comment => reply(comment)));
    Comment.create(commentParams)
    .then(comment => res.status(201).send({comment}))
    .catch(error => res.status(400).send(error));
  },

  list(req, res) {
    Comment.findAll({
      where: {
        gift_id: req.params.gift_id
      },
      include: [{
        model: User,
        attributes: ['email'],
        include: [{
          model: Profile,
          attributes: ['first_name', 'last_name', 'avatar'],
        }],
      }]
    })
    .then(comments => {
      const data = [];
      comments.map(comment => {
        if (comment.parent_id) {
          avatarView(comment);
          const parentComment = comments.find(item =>
            item.id == comment.parent_id).dataValues;
          parentComment.children ?
          parentComment.children.push(comment)
          : parentComment.children = [comment];
        } else {
          avatarView(comment);
          data.push(comment); }
      });
      res.status(200).send({data});
    })
  .catch(error => res.status(400).send(error));
  },

  update(req, res) {
    Comment.findOne({
      where: {
        id: req.params.comment_id,
        user_id: req.decoded.id
      }
    })
    .then(comment =>
      !comment && res.status(404).json({
        'message': messages.commentNotFound,
        'view': messages.danger
      }) || comment.updateAttributes(Object.assign({}, req.body))
      .then(comment => res.status(200).send(comment))
      .catch(error => res.status(400).send(error))
    )
    .catch(error => res.status(400).send(error));
  },

  destroy(req, res) {
    Comment.findOne({
      where: {
        id: req.params.comment_id,
        user_id: req.decoded.id
      }
    })
    .then(comment =>
      !comment && res.status(404).json({
        'message': messages.commentNotFound,
        'view': messages.danger
      }) ||
      Comment.findAll({
        where: {
          gift_id: req.params.gift_id
        }
      })
      .then(comments => {
        const data = [];
        const grabComments = commentId => {
          comments.map(item => {
            if (item.parent_id == commentId) {
              data.push(item);
              grabComments(item.id);
            }
          });
        };
        grabComments(comment.dataValues.id);
        data.map(comment => comment.destroy());
        comment.destroy();
      })
      .then(() => res.status(200).json({
        'message': messages.commentDeleted,
        'view': messages.success
      }))
      .catch(error => res.status(400).send(error))
    );
  }
};
