// models/medicine.model.ts

import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/database'; 
import Diagnosis from './diagnosis';
import { AllModels } from '../utill/types';
import MedicineAttributes from '../schema/medicine'

class Medicine extends Model<MedicineAttributes> implements MedicineAttributes {
  public id!: string;
  public diagnosisId!: string;
  public name!: string;
  public dosage!: number;
  public duration!: number;
  public description!: string;

  // Associations
  public readonly diagnosis?: Diagnosis;

  public static associate(models: AllModels) {
    Medicine.belongsTo(models.Diagnosis, { foreignKey: 'diagnosisId', as: 'diagnosis'});
  }
  static initAttributes = {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
    },
    diagnosisId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: 'diagnosis',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    dosage: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
  }
}

Medicine.init(
  Medicine.initAttributes,
  {
    sequelize,
    tableName: 'medicine',
    timestamps: false,
  }
);

export default Medicine;