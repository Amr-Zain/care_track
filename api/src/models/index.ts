import {  Sequelize } from 'sequelize';
import process from 'process';
import dotenv from 'dotenv';

// Import your models
import User from './user';
import Diagnosis from './diagnosis';
import Medicine from './medicine';
import Clinic from './clinic';
import Appointment from './appointment';
import ClinicSchedule from './clinic_schedule';
import Blood from './blood';
import Receptionist from './receptionist';
import Rating from './rating';
import Session from './session';
import DoctorNurse from './doctor_nurse';

dotenv.config();

const env = process.env.NODE_ENV || 'development';

const getSSLConfig = () => {
  if (env === 'production') {
    return {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false // For self-signed certificates
        }
      }
    };
  }
  return {};
};

const sequelize = process.env.DB_PUBLIC_URL
  ? new Sequelize(process.env.DB_PUBLIC_URL, {
      dialect: 'mysql',
      ...getSSLConfig(),
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    })
  : new Sequelize(
      process.env.DB_NAME!,
      process.env.DB_USER!,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: parseInt(process.env.DB_PORT || '3306'),
        logging: env === 'development' ? console.log : false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
    );

const db = {
  sequelize,
  Sequelize,
  User,
  Diagnosis,
  Medicine,
  Clinic,
  Appointment,
  ClinicSchedule,
  Blood,
  Receptionist,
  Rating,
  DoctorNurse,
  Session
};

Object.values(db).forEach((model: any) => {
  if (model.associate) {
    model.associate(db);
  }
});

export default db;