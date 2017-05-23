'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', [
      {
        email: 'ivan.yarymovych@gmail.com',
        password: 'password',
        profile_id: 1,
        is_activate: true,
        status_state: ''
      },
      {
        email: 'roma@gmail.com',
        password: '13452',
        profile_id: 2,
        is_activate: true,
        status_state: ''
      }
    ], {});
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {});
  }
};
