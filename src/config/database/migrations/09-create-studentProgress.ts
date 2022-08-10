import { QueryInterface, DataTypes, QueryTypes } from 'sequelize';
module.exports = {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.createTable('student_progress', {
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
                student_id: {
                  type: DataTypes.INTEGER,
                  references : {
                    model : 'students',
                    key : 'id'
                  }
                },
                visited_lecture: {
                  type: DataTypes.JSON
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
            await queryInterface.dropTable('student_progress');
        }
    )
};