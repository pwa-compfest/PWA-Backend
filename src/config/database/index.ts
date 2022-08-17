import { Sequelize, Dialect } from 'sequelize'
import dbConfig from './dbConfig';
let staging : any

if(process.env.NODE_ENV === 'production') {
  staging = dbConfig.production;
} else {
  staging = dbConfig.development;
}
export const db = new Sequelize(staging.database, staging.username, staging.password, {
  host: staging.host,
  dialect: staging.dialect as Dialect,
})

db.sync()