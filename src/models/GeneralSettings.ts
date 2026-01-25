import { DataTypes, Model } from 'sequelize';
import sequelize from '../lib/db';

class GeneralSettings extends Model {
  declare id: number;
  declare siteName: string;
  declare siteLogo: string;
  declare metaImage: string;
  declare contactEmail: string;
  declare contactPhone: string;
  declare address: string;
  declare facebookUrl: string;
  declare twitterUrl: string;
  declare instagramUrl: string;
  declare linkedinUrl: string;
  declare metaTitle: string;
  declare metaDescription: string;
  declare metaKeywords: string;
}

GeneralSettings.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    siteName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    siteLogo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metaImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    facebookUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    twitterUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    instagramUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    linkedinUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metaTitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metaDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metaKeywords: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'general_settings',
    sequelize,
    timestamps: true,
  }
);

export default GeneralSettings;
