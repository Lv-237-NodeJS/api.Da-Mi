'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      date_event: {
        type: Sequelize.DATE
      },
      owner: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      location_name: {
        type: Sequelize.STRING
      },
      longitude: {
        type: Sequelize.FLOAT
      },
      latitude: {
        type: Sequelize.FLOAT
      },
      description: {
        type: Sequelize.TEXT
      },
      status_event_id: {
        type: Sequelize.INTEGER,
        unique: false,
        references: {
          model: 'statusEvents',
          key: 'id'
        }
      },
      createdAt: {
        type: Sequelize.BIGINT
      },
      updatedAt: {
        type: Sequelize.BIGINT
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Events');
  }
};
