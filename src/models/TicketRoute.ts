import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../lib/db';

export type TicketRouteStatus = 'Active' | 'Inactive';

interface TicketRouteAttributes {
  id: number;
  from: string;
  to: string;
  airline: string | null;
  /** Starting fare in BDT. Null when the card should not show a price. */
  priceFrom: number | null;
  image: string | null;
  note: string | null;
  status: TicketRouteStatus;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type TicketRouteCreationAttributes = Optional<
  TicketRouteAttributes,
  'id' | 'airline' | 'priceFrom' | 'image' | 'note' | 'status' | 'sortOrder'
>;

class TicketRoute
  extends Model<TicketRouteAttributes, TicketRouteCreationAttributes>
  implements TicketRouteAttributes
{
  declare id: number;
  declare from: string;
  declare to: string;
  declare airline: string | null;
  declare priceFrom: number | null;
  declare image: string | null;
  declare note: string | null;
  declare status: TicketRouteStatus;
  declare sortOrder: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

TicketRoute.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    from: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    to: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    airline: {
      type: DataTypes.STRING(160),
      allowNull: true,
    },
    priceFrom: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      defaultValue: 'Active',
      allowNull: false,
    },
    sortOrder: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'ticket_routes',
    timestamps: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  }
);

export default TicketRoute;
