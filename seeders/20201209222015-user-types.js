'use strict';

const UserTypes = [
    { id: 1, name: "Super Admin",  description: "Super administrator", createdAt: new Date(), updatedAt: new Date() }
];


module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('user_types', UserTypes);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('user_types', null, null);
    }
};
