import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../lib/db';

export type LeadStatus = 'New' | 'Contacted' | 'Converted' | 'Spam' | 'Closed';

interface LeadAttributes {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  /** Where the lead was captured – e.g. "/contact", "Sailor Moon Resorts", "footer". */
  source: string;
  /** Optional URL of the page that submitted the form. */
  pageUrl: string | null;
  status: LeadStatus;
  ipAddress: string | null;
  userAgent: string | null;
  /** Optional referrer URL for additional attribution. */
  referrer: string | null;
  /** Free-form admin notes. */
  notes: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type LeadCreationAttributes = Optional<
  LeadAttributes,
  'id' | 'message' | 'pageUrl' | 'status' | 'ipAddress' | 'userAgent' | 'referrer' | 'notes'
>;

class Lead
  extends Model<LeadAttributes, LeadCreationAttributes>
  implements LeadAttributes
{
  declare id: number;
  declare name: string;
  declare email: string;
  declare phone: string;
  declare message: string;
  declare source: string;
  declare pageUrl: string | null;
  declare status: LeadStatus;
  declare ipAddress: string | null;
  declare userAgent: string | null;
  declare referrer: string | null;
  declare notes: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Lead.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(160),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    source: {
      type: DataTypes.STRING(160),
      allowNull: false,
      defaultValue: 'website',
    },
    pageUrl: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('New', 'Contacted', 'Converted', 'Spam', 'Closed'),
      allowNull: false,
      defaultValue: 'New',
    },
    ipAddress: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
    referrer: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'leads',
    timestamps: true,
    indexes: [
      { fields: ['email'] },
      { fields: ['phone'] },
      { fields: ['ipAddress'] },
      { fields: ['source'] },
      { fields: ['createdAt'] },
    ],
  }
);

export default Lead;
