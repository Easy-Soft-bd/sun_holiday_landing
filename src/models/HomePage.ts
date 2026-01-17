import { DataTypes, Model } from 'sequelize';
import sequelize from '../lib/db';

class HomePage extends Model {
  declare id: number;
  declare hero: any;
  declare airline_marquee: any;
  declare feature_tour: any;
  declare resort_cta: any;
  declare hajj_cta: any;
  declare holiday_categories: any;
  declare booking_process: any;
  declare why_choose_us: any;
}

HomePage.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    hero: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    airline_marquee: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    feature_tour: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    resort_cta: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    hajj_cta: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    holiday_categories: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    booking_process: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    why_choose_us: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: 'page_home',
    sequelize,
    timestamps: true,
  }
);

export default HomePage;
