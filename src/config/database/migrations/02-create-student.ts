import { QueryInterface, DataTypes, QueryTypes } from 'sequelize';
module.exports = {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.createTable('students', {
                id: {
                  allowNull: false,
                  autoIncrement: true,
                  primaryKey: true,
                  type: DataTypes.INTEGER
                },
                nisn: {
                  type: DataTypes.STRING
                },
                user_id: {
                  type: DataTypes.INTEGER,
                  references : {
                    model : 'users',
                    key : 'id'
                  }
                },
                name: {
                  type: DataTypes.STRING
                },
                grade: {
                  type: DataTypes.STRING
                },
                gender: {
                  type: DataTypes.STRING
                },
                majority: {
                  type: DataTypes.STRING
                },
                phone_number: {
                  type: DataTypes.STRING
                },
                photo: {
                  type: DataTypes.STRING
                },
                createdAt: {
                  allowNull: true,
                  type: DataTypes.DATE
                },
                updatedAt: {
                  allowNull: true,
                  type: DataTypes.DATE
                }
              });
        }
    ),

    down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.dropTable('students');
        }
    )
};