import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../lib/db';
import Booking from './Booking';

/**
 * Activity types tracked on a booking. Keep this list narrow so the timeline
 * in the admin CRM stays meaningful – pick the closest match in the API layer.
 */
export type BookingActivityType =
  | 'note'
  | 'status_change'
  | 'call'
  | 'email'
  | 'sms'
  | 'whatsapp'
  | 'meeting'
  | 'system';

interface BookingActivityAttributes {
  id: number;
  bookingId: number;
  /** Discriminator describing what kind of event this row represents. */
  type: BookingActivityType;
  /** Free-form admin/system body, e.g. note text or short status summary. */
  body: string;
  /** Optional structured payload (e.g. { from: 'New', to: 'Contacted' }). */
  meta: Record<string, unknown> | null;
  /** Email of the admin user who triggered the activity, when available. */
  authorEmail: string | null;
  /** Friendly label for the actor (admin name) or "System" for auto entries. */
  authorLabel: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type BookingActivityCreationAttributes = Optional<
  BookingActivityAttributes,
  'id' | 'meta' | 'authorEmail' | 'authorLabel' | 'body'
>;

class BookingActivity
  extends Model<BookingActivityAttributes, BookingActivityCreationAttributes>
  implements BookingActivityAttributes
{
  declare id: number;
  declare bookingId: number;
  declare type: BookingActivityType;
  declare body: string;
  declare meta: Record<string, unknown> | null;
  declare authorEmail: string | null;
  declare authorLabel: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

BookingActivity.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    bookingId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: Booking, key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    type: {
      type: DataTypes.ENUM(
        'note',
        'status_change',
        'call',
        'email',
        'sms',
        'whatsapp',
        'meeting',
        'system'
      ),
      allowNull: false,
      defaultValue: 'note',
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    authorEmail: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    authorLabel: {
      type: DataTypes.STRING(160),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'booking_activities',
    timestamps: true,
    indexes: [
      { fields: ['bookingId'] },
      { fields: ['type'] },
      { fields: ['createdAt'] },
    ],
  }
);

BookingActivity.belongsTo(Booking, { foreignKey: 'bookingId', as: 'Booking' });
Booking.hasMany(BookingActivity, {
  foreignKey: 'bookingId',
  as: 'Activities',
  onDelete: 'CASCADE',
});

export default BookingActivity;
