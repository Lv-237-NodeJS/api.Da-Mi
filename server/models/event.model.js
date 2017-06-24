'use strict';

module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date_event: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    owner: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    location_name: {
      type: DataTypes.STRING
    },
    longitude: {
      type: DataTypes.FLOAT
    },
    latitude: {
      type: DataTypes.FLOAT
    },
    description: {
      type: DataTypes.TEXT
    },
    status_event_id: {
      allowNull: false,
      unique: false,
      type: DataTypes.INTEGER,
      defaultValue: 1
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
    paranoid: false,
    timestamps: false,
    classMethods: {
      associate: models => {
        Event.hasOne(models.statusEvent, {
          foreignKey: 'id'
        });
      }
    },
    hooks: {
      beforeCreate: (event, options) => {
        event.date_event = event.date_event.getTime();
        event.createdAt = new Date().getTime();
        event.updatedAt = new Date().getTime();
      },
      beforeUpdate: (event, options) => {
        event.updatedAt = new Date().getTime();
      }
    }
  });
  return Event;
};
