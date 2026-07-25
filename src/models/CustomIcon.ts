import { DataTypes, Model, type Optional } from 'sequelize';
import sequelize from '../lib/db';
import type { ParsedCustomIcon } from '../lib/icons/custom-icon-svg';

interface CustomIconAttributes {
  id: number;
  /** Slug used to reference the icon, e.g. `check-circle` for `custom:check-circle`. */
  name: string;
  label: string;
  /** Original pasted markup, kept so the admin can re-edit it later. */
  svg: string;
  /** Validated tree that is actually rendered. */
  content: ParsedCustomIcon | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type CustomIconCreationAttributes = Optional<CustomIconAttributes, 'id'>;

class CustomIcon
  extends Model<CustomIconAttributes, CustomIconCreationAttributes>
  implements CustomIconAttributes
{
  declare id: number;
  declare name: string;
  declare label: string;
  declare svg: string;
  declare content: ParsedCustomIcon | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

CustomIcon.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
    },
    label: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    svg: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    content: {
      type: DataTypes.JSON,
      allowNull: true,
      get(): ParsedCustomIcon | null {
        const rawValue = this.getDataValue('content');

        // MySQL returns JSON columns as strings through some driver versions.
        if (typeof rawValue !== 'string') {
          return rawValue ?? null;
        }

        try {
          return JSON.parse(rawValue);
        } catch {
          return null;
        }
      },
    },
  },
  {
    sequelize,
    tableName: 'custom_icons',
    timestamps: true,
  }
);

export default CustomIcon;
