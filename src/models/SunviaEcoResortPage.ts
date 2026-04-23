import { DataTypes, Model } from "sequelize";
import sequelize from "../lib/db";

class SunviaEcoResortPage extends Model {
  declare id: number;
  declare seo: unknown;
  declare hero: unknown;
  declare about: unknown;
  declare accommodations: unknown;
  declare dining: unknown;
  declare activities: unknown;
  declare eco: unknown;
  declare events: unknown;
  declare gallery: unknown;
  declare services: unknown;
  declare contact: unknown;
}

function jsonColumn(fieldName: string) {
  return {
    type: DataTypes.JSON,
    allowNull: true,
    get(this: SunviaEcoResortPage) {
      const rawValue = this.getDataValue(fieldName as keyof SunviaEcoResortPage);
      return typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
    },
    set(this: SunviaEcoResortPage, value: unknown) {
      this.setDataValue(fieldName as keyof SunviaEcoResortPage, value);
    },
  };
}

SunviaEcoResortPage.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    seo: jsonColumn("seo"),
    hero: jsonColumn("hero"),
    about: jsonColumn("about"),
    accommodations: jsonColumn("accommodations"),
    dining: jsonColumn("dining"),
    activities: jsonColumn("activities"),
    eco: jsonColumn("eco"),
    events: jsonColumn("events"),
    gallery: jsonColumn("gallery"),
    services: jsonColumn("services"),
    contact: jsonColumn("contact"),
  },
  {
    tableName: "page_sunvia_eco_resort",
    sequelize,
    timestamps: true,
  },
);

export default SunviaEcoResortPage;
