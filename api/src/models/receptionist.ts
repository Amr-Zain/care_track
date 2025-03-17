// models/receptionist.model.ts

import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/database'; 
import User from './user'; 
import Clinic from './clinic'; 
import { AllModels } from '../utill/types';
interface ReceptionistAttributes {
  receptionistId: string;
  doctorId: string;
  clinicId: string;
}

class Receptionist extends Model<ReceptionistAttributes> implements ReceptionistAttributes {
  public receptionistId!: string;
  public doctorId!: string;
  public clinicId!: string;

  // Associations
  public readonly receptionistUser?: User; 
  public readonly doctorUser?: User; 
  public readonly clinic?: Clinic;

  public static associate(models: AllModels) {
    Receptionist.belongsTo(models.User, { foreignKey: 'receptionistId', as: 'receptionist' });
    Receptionist.belongsTo(models.User, { foreignKey: 'doctorId', as: 'doctor' });
    Receptionist.belongsTo(models.Clinic, { foreignKey: 'clinicId', as:'clinic' });
  }
  static initAttributes = {
    receptionistId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      unique: true,
      references: {
        model: 'user', // Ensure this matches actual table name
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      primaryKey: true,
    },
    doctorId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: 'user', // Ensure this matches actual table name
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    clinicId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: 'clinic', // Ensure this matches actual table name
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  }
}

Receptionist.init(
  Receptionist.initAttributes,
  {
    sequelize,
    tableName: 'receptionist',
    timestamps: false,
  }
);

export default Receptionist;