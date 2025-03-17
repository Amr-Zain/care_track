import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DB_PUBLIC_URL, {
    dialect: 'mysql',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        }
    }
});

export default sequelize;