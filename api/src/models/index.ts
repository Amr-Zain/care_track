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

let sequelize: Sequelize;
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: env === 'development' ? console.log : false,
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASSWORD as string,
    {
      host: process.env.DB_HOST,
      dialect: 'mysql',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    }
  );
}

// Setup associations
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