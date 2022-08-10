import { Sequelize, Dialect } from 'sequelize'
import dbConfig from './dbConfig';

export const db = new Sequelize(dbConfig.development.database, dbConfig.development.username, dbConfig.development.password, {
  host: dbConfig.development.host,
  dialect: dbConfig.development.dialect as Dialect,
})

db.sync()