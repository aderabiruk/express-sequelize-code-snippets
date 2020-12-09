'use strict';

const uuid = require("uuid");
const bcrypt = require("bcrypt");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        let password = await bcrypt.hash('password', 10);
        await queryInterface.bulkInsert('users', [
            {
                id: 1,
                code: uuid.v4(),
                name: 'Biruk Adera',
                username: 'aderabiruk',
                email: 'aderabiruk@gmail.com',
                user_type_id: 1,
                password: password,
                is_active: true,
                is_locked: false,
                createdAt: new Date(), 
                updatedAt: new Date()
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
    }
};
