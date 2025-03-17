// models/appointment.model.ts

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/database'; 
import AppointmentAttributes from '../schema/appointment'
import { AllModels } from '../utill/types';
import User from './user';
import Clinic from './clinic';



class Appointment extends Model<AppointmentAttributes, Optional<AppointmentAttributes, 'clinicId' | 'nurseId'>> implements AppointmentAttributes {
  public id!: string;
  public patientId!: string;
  public clinicId!: string | null;
  public nurseId!: string | null;
  public date!: Date;
  public bookedAt!: Date;
  public doctorId?: string| null
  // Associations
  public readonly patient?: User; 
  public readonly clinic?: Clinic;
  public readonly nurse?: User;

  public static associate(models: AllModels) {
    Appointment.belongsTo(models.User, { foreignKey: 'patientId', as: 'patient' });
    Appointment.belongsTo(models.Clinic, { foreignKey: 'clinicId', as: 'clinic' });
    Appointment.belongsTo(models.User, { foreignKey: 'nurseId', as: 'nurse' });
  }
  static initAttributes ={
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
    },
    patientId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: 'user', 
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    clinicId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      references: {
        model: 'clinic', // Ensure this matches actual table name
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    nurseId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      references: {
        model: 'user', // Ensure this matches actual table name
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    bookedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }
}

Appointment.init(
  Appointment.initAttributes
  ,
  {
    sequelize,
    tableName: 'appointment',
    timestamps: false,
  }
);

export default Appointment;