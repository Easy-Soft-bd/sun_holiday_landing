import { DataTypes, Model } from 'sequelize';
import sequelize from '../lib/db';
import bcrypt from 'bcryptjs';

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EDITOR = 'EDITOR',
  USER = 'USER'
}

class User extends Model {
  declare id: number;
  declare email: string;
  declare password: string;
  declare name: string | null;
  declare role: UserRole;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  // Method to compare password
  public comparePassword(password: string): boolean {
    return bcrypt.compareSync(password, this.getDataValue('password'));
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      set(value: string) {
        // Automatically hash the password when it's set
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(value, salt);
        this.setDataValue('password', hash);
      }
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
      defaultValue: UserRole.USER,
    },
  },
  {
    tableName: 'users',
    sequelize,
    // Default scope to protect the password field from being returned in normal queries
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ['password'] },
      },
    },
  }
);

export default User;
