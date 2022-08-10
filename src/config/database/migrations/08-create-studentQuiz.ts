import { QueryInterface, DataTypes, QueryTypes } from 'sequelize';
module.exports = {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.createTable('student_quiz', {
                id: {
                  allowNull: false,
                  autoIncrement: true,
                  primaryKey: true,
                  type: DataTypes.INTEGER
                },
                student_id: {
                    type: DataTypes.INTEGER,
                    references : {
                      model : 'students',
                      key : 'id'
                    }
                },
                quiz_id: {
                  type: DataTypes.INTEGER,
                  references : {
                    model : 'quiz',
                    key : 'id'
                  }
                },
                question_data: {
                  type: DataTypes.JSON
                },
                quiz_result: {
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
            await queryInterface.dropTable('student_quiz');
        }
    )
};