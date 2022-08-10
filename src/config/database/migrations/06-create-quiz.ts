import { QueryInterface, DataTypes, QueryTypes } from 'sequelize';
module.exports = {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.createTable('quiz', {
                id: {
                  allowNull: false,
                  autoIncrement: true,
                  primaryKey: true,
                  type: DataTypes.INTEGER
                },
                course_id: {
                  type: DataTypes.INTEGER,
                  references : {
                    model : 'courses',
                    key : 'id'
                  }
                },
                name: {
                  type: DataTypes.STRING
                },
                description: {
                  type: DataTypes.TEXT
                },
                total_question: {
                    type: DataTypes.INTEGER
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
            await queryInterface.dropTable('quiz');
        }
    )
};