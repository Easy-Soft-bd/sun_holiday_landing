import { DataTypes, Model } from "sequelize";
import sequelize from "../lib/db";
import { RESORT_SECTION_KEYS } from "../lib/data/sunvia-eco-resort";

class SunviaEcoResortPage extends Model {
  declare id: number;
  /** Legacy guest-page columns. Kept so sync does not drop stored history. Not read by the investor page. */
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
  declare investor_seo: unknown;
  declare investor_hero: unknown;
  declare master_plan: unknown;
  declare investment_model: unknown;
  declare investment: unknown;
  declare demand: unknown;
  declare roadmap: unknown;
  declare why_sunvia: unknown;
  declare terms: unknown;
  declare faq: unknown;
  declare lead: unknown;
  /** Earlier investor-page columns. Kept so sync does not drop stored history. Not read by the page. */
  declare vision: unknown;
  declare business_model: unknown;
  declare revenue: unknown;
  declare understand: unknown;
  declare profit: unknown;
  declare payment_example: unknown;
  declare project_status: unknown;
  declare features: unknown;
  declare people: unknown;
  declare documents: unknown;
  declare journey: unknown;
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

const legacyColumns = [
  "seo",
  "hero",
  "about",
  "accommodations",
  "dining",
  "activities",
  "eco",
  "events",
  "gallery",
  "services",
  "contact",
] as const;

const retiredColumns = [
  "vision",
  "business_model",
  "revenue",
  "understand",
  "profit",
  "payment_example",
  "project_status",
  "features",
  "people",
  "documents",
  "journey",
] as const;

const attributes = Object.fromEntries(
  [...legacyColumns, ...RESORT_SECTION_KEYS, ...retiredColumns].map((fieldName) => [
    fieldName,
    jsonColumn(fieldName),
  ]),
);

SunviaEcoResortPage.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    ...attributes,
  },
  {
    tableName: "page_sunvia_eco_resort",
    sequelize,
    timestamps: true,
  },
);

export default SunviaEcoResortPage;
