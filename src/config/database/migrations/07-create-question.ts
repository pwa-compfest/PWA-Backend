import { QueryInterface, DataTypes, QueryTypes } from 'sequelize';
module.exports = {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.createTable('questions', {
                id: {
                  allowNull: false,
                  autoIncrement: true,
                  primaryKey: true,
                  type: DataTypes.INTEGER
                },
                quiz_id: {
                  type: DataTypes.INTEGER,
                  references : {
                    model : 'quiz',
                    key : 'id'
                  }
                },
                question: {
                  type: DataTypes.STRING
                },
                answer: {
                  type: DataTypes.JSON
                },
                answer_right: {
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
            await queryInterface.dropTable('questions');
        }
    )
};