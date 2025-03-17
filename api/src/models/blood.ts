// models/blood.model.ts

import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/database'; 
import User from './user';
import { AllModels } from '../utill/types';
import { BloodRequest } from '../schema';
 

class Blood extends Model<BloodRequest> implements BloodRequest {
  public id!: string;
  public patientId!: string;
  public isRequest!: boolean;
  public bloodType!: ["A+", "A-", "B+", "B-", "O-", "AB+", "AB-", "All"];
  public city!: string;
  public date!: Date;
  public describtion!: string | null;

  // Associations
  public readonly patient?: User; // Use User model type

  public static associate(models: AllModels) {
    Blood.belongsTo(models.User, { foreignKey: 'patientId', as: 'patient'});
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
        model: 'user', // Ensure this matches actual table name
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    isRequest: {
      type: DataTypes.TINYINT({ length: 1 }),
      allowNull: false,
    },
    bloodType: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    describtion: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
  }
}

Blood.init(
  Blood.initAttributes
  ,
  {
    sequelize,
    tableName: 'blood',
    timestamps: false,
  }
);

export default Blood;