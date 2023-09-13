'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Tasks', 'deadline', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.sequelize.query(
      'ALTER TYPE "enum_Tasks_status" ADD VALUE \'expired\';',
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Tasks', 'deadline');
    await queryInterface.sequelize.query(
      'ALTER TYPE "enum_Tasks_status" DROP VALUE \'expired\';',
    );
  },
};
