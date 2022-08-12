import { QueryInterface, DataTypes, QueryTypes } from 'sequelize';

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction) => {
      await queryInterface.createTable('change_password_tokens', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER
        },
        user_id: {
          type: DataTypes.INTEGER,
          references: {
            model: 'users',
            key: 'id'
          }
        },
        expires: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        hashed_token: {
          allowNull: false,
          unique: true,
          type: DataTypes.TEXT
        }
      });
    }
  ),

  down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction) => {
      await queryInterface.dropTable('change_password_tokens');
    }
  )
};