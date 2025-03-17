// models/rating.model.ts

import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/database'; 
import User from './user';
import { AllModels } from '../utill/types';
import { Rating } from '../schema/doctor-nurse'

class RatingModel extends Model<Rating> implements Rating {
  public ratedId!: string;
  public patientId!: string;
  public rating!: number;
  public comment!: string | null;

  // Associations
  public readonly ratedDoctorOrNurse?: User;
  public readonly patient?: User;

  public static associate(models: AllModels) {
    RatingModel.belongsTo(models.User, { foreignKey: 'ratedId', as: 'ratedDoctorNurse' });
    RatingModel.belongsTo(models.User, { foreignKey: 'patientId', as: 'patient' });
  }
  static initAttributes = {
    ratedId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      primaryKey:true,
      references: {
        model: 'user',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    patientId: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
  }
}

RatingModel.init(
  RatingModel.initAttributes,
  {
    sequelize,
    tableName: 'rating',
    timestamps: false,
  }
);

export default RatingModel;