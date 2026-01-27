import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../lib/db';

export type TourCategory = 'International' | 'Domestic' | 'Hajj & Umrah';

export interface TourItineraryDay {
  day: number;
  title: string;
  description: string;
}

interface TourAttributes {
  id: number;
  title: string;
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
  createdAt?: Date;
  updatedAt?: Date;
}

interface TourCreationAttributes extends Optional<TourAttributes, 'id' | 'rating' | 'reviews'> {}

class Tour extends Model<TourAttributes, TourCreationAttributes> implements TourAttributes {
  declare id: number;
  declare title: string;
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
  },
  {
    sequelize,
    tableName: 'tours',
    timestamps: true,
  }
);

export default Tour;
