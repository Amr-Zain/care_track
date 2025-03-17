// models/clinic_schedule.model.ts

import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/database'; 
import Clinic from './clinic'; 
import { AllModels } from '../utill/types';
import { ClinicSchedule as ClinicScheduleAttributes, Day  } from '../schema/clinic'

class ClinicSchedule extends Model<ClinicScheduleAttributes> implements ClinicScheduleAttributes {
  public day!: Day;
  public clinicId!: string;
  public from!: string;
  public to!: string;

  // Associations
  public readonly clinic?: Clinic; // Use Clinic model type

  public static associate(models: AllModels) {
    ClinicSchedule.belongsTo(models.Clinic, { foreignKey: 'clinicId', as:'clinic' });
  }
  static initAttributes ={
    day: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    clinicId: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'clinic', // Ensure this matches actual table name
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    from: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    to: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  }
}

ClinicSchedule.init(
  ClinicSchedule.initAttributes,
  {
    sequelize,
    tableName: 'clinic_schedule',
    timestamps: false,
  }
);

export default ClinicSchedule;