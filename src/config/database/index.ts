import { Sequelize, Dialect } from 'sequelize'
import dbConfig from './dbConfig';
let nodeEnv: any

if (process.env.NODE_ENV === 'production') {
  nodeEnv = dbConfig.production;
} else {
  nodeEnv = dbConfig.development;
}
export const db = new Sequelize(nodeEnv.database, nodeEnv.username, nodeEnv.password, {
  host: nodeEnv.host,
  port: nodeEnv.port,
  dialect: nodeEnv.dialect as Dialect
})

db.sync()

