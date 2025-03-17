import { DataTypes, Model, Optional } from 'sequelize';
import UserAttributes from '../schema/user'
import { AllModels, UserType } from "../utill/types";
import sequelize from '../db/database'; 


class User extends Model<UserAttributes, Optional<UserAttributes, 'city' | 'image' | 'gender'>> implements UserAttributes {
  public id!: string;
  public userType!: UserType;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public password!: string;
  public phone: number;
  public city!: string | null;
  public image!: string | null;
  public gender!: boolean | null;
  public birthday!: Date;
  public createdAt: Date;

  // Timestamps (if enabled)
  public readonly updatedAt!: Date;

  // Associations
  public readonly user_type?: UserType;
  public static associate(models: AllModels) {
    User.hasMany(models.DoctorNurse, { foreignKey: 'userId', as: 'DoctorNurse'}); 
    User.hasMany(models.Receptionist, { foreignKey: 'receptionistId' }); 
    User.hasMany(models.Rating, { foreignKey: 'ratedId', as:'ratedDoctorNurse' }); 
    User.hasMany(models.Blood, { foreignKey: 'patientId', as:'patientId' }); 

  }
  static initAttributes = {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      unique: true,
    },
    userType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user_type',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'NO ACTION',
    },
    firstName: {
      type: DataTypes.STRING(55),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(55),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.CHAR(11),
      allowNull: false,
      unique: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING(350),
      allowNull: true,
    },
    gender: {
      type: DataTypes.TINYINT({ length: 1 }), // Corrected gender type
      allowNull: true,
    },
    birthday: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }

}

User.init(
  User.initAttributes,
  {
    sequelize,
    tableName: 'user',
    timestamps: false,
  }
);

export default User;