import { Model, DataTypes } from 'sequelize';
import User from './user'; 
import { AllModels } from '../utill/types';
import sequelize from '../db/database'; 
import { Session as SessionAttributes  } from '../schema';


class Session extends Model<SessionAttributes> implements SessionAttributes {
  public id!: string;
  public userId!: string;
  public userType!: number;
  public valid!: boolean | null;
  public userAgent!: string | null;
  public createdAt!: Date | null;
  public lastAccess!: Date | null;

  public static associate(models: AllModels) {
    Session.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
  static initAttributes = {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    userType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user_type',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    valid: {
      type: DataTypes.TINYINT({ length: 1 }),
      allowNull: true,
      defaultValue: 1,
    },
    userAgent: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lastAccess: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }
}

Session.init(
  Session.initAttributes,
  {
    sequelize,
    tableName: 'session',
    timestamps: false, // Assuming you're handling timestamps manually
  }
);

export default Session;