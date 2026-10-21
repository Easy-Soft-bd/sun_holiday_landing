import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../lib/db';

export type VisaCountryStatus = 'Draft' | 'Active' | 'Inactive';

interface VisaCountryAttributes {
  id: number;
  name: string;
  /** URL segment for `/visa/[slug]` (unique). */
  slug: string;
  /** Uploaded flag image. At least one of flagImage or flagEmoji is required. */
  flagImage: string | null;
  /** Emoji fallback when no flag image has been uploaded. */
  flagEmoji: string | null;
  coverImage: string;
  /** Short summary for directory cards, search, and the meta description fallback. */
  excerpt: string;
  /** Rich-text HTML: procedures, requirements, documents, and fees. */
  content: string;
  status: VisaCountryStatus;
  sortOrder: number;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface VisaCountryCreationAttributes
  extends Optional<
    VisaCountryAttributes,
    'id' | 'flagImage' | 'flagEmoji' | 'status' | 'sortOrder' | 'metaTitle' | 'metaDescription'
  > {}

class VisaCountry
  extends Model<VisaCountryAttributes, VisaCountryCreationAttributes>
  implements VisaCountryAttributes
{
  declare id: number;
  declare name: string;
  declare slug: string;
  declare flagImage: string | null;
  declare flagEmoji: string | null;
  declare coverImage: string;
  declare excerpt: string;
  declare content: string;
  declare status: VisaCountryStatus;
  declare sortOrder: number;
  declare metaTitle: string | null;
  declare metaDescription: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

VisaCountry.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    flagImage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    flagEmoji: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    coverImage: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    excerpt: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Draft', 'Active', 'Inactive'),
      defaultValue: 'Draft',
      allowNull: false,
    },
    sortOrder: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    metaTitle: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    metaDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'visa_countries',
    timestamps: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  }
);

export default VisaCountry;
