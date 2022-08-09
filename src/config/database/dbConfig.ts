import { Dialect } from 'sequelize';

const dbConfig = {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'fajarbuana',
    database: process.env.DB_NAME || 'perwibuanlms-api',
    host: process.env.DB_HOST || '127.0.0.1',
    driver: 'postgres' as Dialect,
}

export default dbConfig 