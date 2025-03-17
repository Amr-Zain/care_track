// models/doctor_nurse.model.ts

import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/database'; 
import User from './user';
import { AllModels } from '../utill/types';
import { DoctorNurseAttributes } from '../schema/doctor-nurse'

class DoctorNurse extends Model<DoctorNurseAttributes> implements DoctorNurseAttributes {
  public userId!: string;
  public specialization!: string | null;
  public fees!: number;
  public description!: string;
  public appointmentTime!: number | null;
  public location!: string | null;

  // Associations
  public readonly user?: User;

  public static associate(models: AllModels) {
    DoctorNurse.belongsTo(models.User, { foreignKey: 'userId', as:'DoctorNurse' });
    DoctorNurse.hasMany(models.Clinic, { foreignKey: 'doctorId', as:'doctor' });
    DoctorNurse.hasMany(models.Diagnosis, { foreignKey: 'doctorId', as:'diagosis' });
  }
  static initAttributes =  {
    userId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      primaryKey: true,
      unique: true,
      references: {
        model: 'user',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fees: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    appointmentTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
  }
}

DoctorNurse.init(
  DoctorNurse.initAttributes,
  {
    sequelize,
    tableName: 'doctor_nurse',
    timestamps: false,
  }
);

export default DoctorNurse;