'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('posts','imageURL',{
      type:Sequelize.STRING(100),
      allowNull:true
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('post','imageURL');
  }
};
