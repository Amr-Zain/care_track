// models/clinic.model.ts

import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/database'; 
import User from './user'; 
import { AllModels } from '../utill/types';
import ClinicAttributes from '../schema/clinic'
import { Appointment } from '../schema';
import ClinicSchedule from './clinic_schedule';


class Clinic extends Model<ClinicAttributes> implements ClinicAttributes {
  public id!: string;
  public doctorId!: string;
  public city!: string;
  public location!: string;
  public clinicName!: string | null;
  public phone!: string;
  public schedule?: ClinicSchedule[];

  // Associations
  public readonly doctor?: User; // Use User model type
  public getAppointments!: () => Promise<Appointment[]>; // Add this line

  public static associate(models: AllModels) {
    Clinic.belongsTo(models.User, { foreignKey: 'doctorId', as: 'doctor'  });
    Clinic.belongsTo(models.DoctorNurse, { foreignKey: 'doctorId', as: 'DoctorNurse'  });
    Clinic.hasMany(models.Appointment, { foreignKey: 'clinicId' });
    Clinic.hasMany(models.ClinicSchedule, { foreignKey: 'clinicId', as:'clinicSchedule' }); 

  }
  static initAttributes ={
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      unique: true,
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
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(455),
      allowNull: false,
    },
    clinicName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    phone: {
      type: DataTypes.CHAR(11),
      allowNull: false,
      unique: true,
    },
  }
}
Clinic.init(
  Clinic.initAttributes,
  {
    sequelize,
    tableName: 'clinic',
    timestamps: false,
  }
);

export default Clinic;