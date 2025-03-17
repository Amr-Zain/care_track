// models/diagnosis.model.ts

import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/database'; 
import User from './user';
import Clinic from './clinic';
import { AllModels } from '../utill/types';
import { Diagnosis as DiagnosisAttributes, Medicine } from '../schema';


class Diagnosis extends Model<Omit<DiagnosisAttributes,'medicines'> > implements Omit<DiagnosisAttributes,'medicines'> {
  public id!: string;
  public patientId!: string;
  public doctorId!: string;
  public clinicId!: string;
  public date!: Date;
  public description!: string;
  public medicines: Medicine[]| undefined;

  // Associations
  public readonly patient?: User;
  public readonly doctor?: User;
  public readonly clinic?: Clinic;

  public static associate(models: AllModels) {
    Diagnosis.belongsTo(models.User, { foreignKey: 'patientId', as: 'patient' });
    Diagnosis.belongsTo(models.DoctorNurse, { foreignKey: 'doctorId', as: 'DoctorNurse' });
    Diagnosis.belongsTo(models.User, { foreignKey: 'doctorId', as: 'doctor' });
    Diagnosis.belongsTo(models.Clinic, { foreignKey: 'clinicId' });
  }
  static initAttributes = {
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
    doctorId: {
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
      allowNull: false,
      references: {
        model: 'clinic',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
  }
}

Diagnosis.init(
  Diagnosis.initAttributes,
  {
    sequelize,
    tableName: 'diagnosis',
    timestamps: false,
  }
);

export default Diagnosis;