// config/db.js
import { Sequelize } from 'sequelize';
import { config } from '../env/config.js';

const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    dialect: 'mysql',
    logging: false,
  },
);

export default sequelize;
