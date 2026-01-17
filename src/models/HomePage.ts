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
      get() {
        const rawValue = this.getDataValue('hero');
        return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
      },
      set(value: any) {
        this.setDataValue('hero', value);
      },
    },
    airline_marquee: {
      type: DataTypes.JSON,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('airline_marquee');
        return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
      },
      set(value: any) {
        this.setDataValue('airline_marquee', value);
      },
    },
    feature_tour: {
      type: DataTypes.JSON,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('feature_tour');
        return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
      },
      set(value: any) {
        this.setDataValue('feature_tour', value);
      },
    },
    resort_cta: {
      type: DataTypes.JSON,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('resort_cta');
        return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
      },
      set(value: any) {
        this.setDataValue('resort_cta', value);
      },
    },
    hajj_cta: {
      type: DataTypes.JSON,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('hajj_cta');
        return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
      },
      set(value: any) {
        this.setDataValue('hajj_cta', value);
      },
    },
    holiday_categories: {
      type: DataTypes.JSON,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('holiday_categories');
        return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
      },
      set(value: any) {
        this.setDataValue('holiday_categories', value);
      },
    },
    booking_process: {
      type: DataTypes.JSON,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('booking_process');
        return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
      },
      set(value: any) {
        this.setDataValue('booking_process', value);
      },
    },
    why_choose_us: {
      type: DataTypes.JSON,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('why_choose_us');
        return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
      },
      set(value: any) {
        this.setDataValue('why_choose_us', value);
      },
    },
  },
  {
    tableName: 'page_home',
    sequelize,
    timestamps: true,
  }
);

export default HomePage;
