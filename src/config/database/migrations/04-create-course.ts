import { QueryInterface, DataTypes, QueryTypes } from 'sequelize';
module.exports = {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.createTable('courses', {
                id: {
                  allowNull: false,
                  autoIncrement: true,
                  primaryKey: true,
                  type: DataTypes.INTEGER
                },
                instructor_id: {
                  type: DataTypes.INTEGER,
                  references : {
                    model : 'instructors',
                    key : 'id'
                  }
                },
                title: {
                  type: DataTypes.STRING
                },
                description: {
                  type: DataTypes.TEXT
                },
                is_verified: {
                    type: DataTypes.BOOLEAN
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
            await queryInterface.dropTable('courses');
        }
    )
};