'use strict';

const { hooks } = require('./../helper');

module.exports = function(sequelize, DataTypes) {
  const Guest = sequelize.define('Guest', {
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false
    },
    status: {
      type: DataTypes.ENUM,
      values: ['going', 'notgoing', 'undecided'],
      defaultValue: 'undecided',
      allowNull: false
    },
    createdAt: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    timestamps: false,
    classMethods: {
      associate: models => {
        Guest.belongsTo(models.User, {
          foreignKey: 'user_id',
          hooks: true
        });
        Guest.belongsTo(models.Event, {
          foreignKey: 'event_id'
        });
      }
    },
    hooks: {
      beforeCreate: hooks.beforeCreate,
      beforeUpdate: hooks.beforeUpdate
    }
  });
  return Guest;
};
