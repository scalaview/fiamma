'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Commands', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      namespace: {
        type: Sequelize.STRING
      },
      funName: {
        type: Sequelize.STRING
      },
      argsCode: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      resultCode: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Commands');
  }
};