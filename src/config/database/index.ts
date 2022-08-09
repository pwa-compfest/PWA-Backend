import {Sequelize} from 'sequelize'
import dbConfig from './dbConfig';

export const db = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.driver,
})
db.sync()
export { dbConfig }