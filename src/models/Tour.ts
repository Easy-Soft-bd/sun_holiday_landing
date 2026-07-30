import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../lib/db';
import Location from './Location';

export type TourCategory = 'International' | 'Domestic' | 'Hajj & Umrah';

export interface TourItineraryDay {
  day: number;
  title: string;
  description: string;
}

interface TourAttributes {
  id: number;
  title: string;
  /** URL segment for public tour pages (unique). */
  slug: string | null;
  /** FK to `locations`; denormalized `location` string kept for legacy rows and quick reads. */
  locationId: number | null;
  location: string;
  price: number;
  duration: string;
  category: TourCategory;
  status: 'Draft' | 'Active' | 'Inactive';
  image: string;
  inquiryPhone?: string;
  rating: number;
  reviews: number;
  description: string;
  highlights: string[];
  itinerary: TourItineraryDay[];
  includes: string[];
  excludes: string[];
  gallery: string[];
  videoUrl?: string;
  /** When true, Active tours appear in the home "Popular Tour Packages" slider. */
  showOnHome: boolean;
  /** Ascending order in the home slider (lower first). */
  homeSortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TourCreationAttributes
  extends Optional<
    TourAttributes,
    'id' | 'rating' | 'reviews' | 'slug' | 'locationId' | 'showOnHome' | 'homeSortOrder'
  > {}

class Tour extends Model<TourAttributes, TourCreationAttributes> implements TourAttributes {
  declare id: number;
  declare title: string;
  declare slug: string | null;
  declare locationId: number | null;
  declare location: string;
  declare price: number;
  declare duration: string;
  declare category: TourCategory;
  declare status: 'Draft' | 'Active' | 'Inactive';
  declare inquiryPhone: string;
  declare image: string;
  declare rating: number;
  declare reviews: number;
  declare description: string;
  declare highlights: string[];
  declare itinerary: TourItineraryDay[];
  declare includes: string[];
  declare excludes: string[];
  declare gallery: string[];
  declare videoUrl: string;
  declare showOnHome: boolean;
  declare homeSortOrder: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Tour.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    locationId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: Location,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('International', 'Domestic', 'Hajj & Umrah'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Draft', 'Active', 'Inactive'),
      defaultValue: 'Draft',
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT, // Text to handle long URLs
      allowNull: false,
    },
    inquiryPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    reviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    highlights: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    itinerary: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    includes: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    excludes: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    gallery: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    showOnHome: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    homeSortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'tours',
    timestamps: true,
  }
);

Tour.belongsTo(Location, { foreignKey: 'locationId', as: 'Location' });
Location.hasMany(Tour, { foreignKey: 'locationId' });

export default Tour;
