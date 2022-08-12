const dbConfig = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres'
  },
}
export default dbConfig
module.exports = dbConfig