import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../lib/db';
import Tour from './Tour';

export type BookingStatus = 'New' | 'Contacted' | 'Confirmed' | 'Cancelled';

/**
 * Service the customer is asking about. `tour` is the legacy default for the
 * tour-package modal; the others power the ticket / visa / resort flows that
 * share the same booking pipeline.
 */
export type BookingServiceType = 'tour' | 'ticket' | 'visa' | 'resort' | 'general';

interface BookingAttributes {
  id: number;
  name: string;
  phone: string;
  /** Email is optional — the ticket flow only collects name + phone. */
  email: string | null;
  /** Optional preferred booking date (ISO string). */
  bookingDate: Date | null;
  message: string;
  status: BookingStatus;
  /** What kind of service this booking is for. Drives admin filtering & UI. */
  serviceType: BookingServiceType;
  /** Friendly snapshot label shown in the admin list (e.g. "DAC → DXB", "UAE Tourist Visa"). */
  serviceTitle: string | null;
  /** Free-form structured payload for service-specific fields (search params, country, etc.). */
  details: Record<string, unknown> | null;
  /**
   * FK to `tours.id` when the booking was placed for a specific package.
   * `SET NULL` on delete so old bookings keep a denormalized snapshot in
   * `tourTitle` even after the tour is removed.
   */
  tourId: number | null;
  /** Snapshot of the tour title at booking time (resilient to tour edits/deletes). */
  tourTitle: string | null;
  /** Snapshot of the tour slug at booking time so admins can rebuild a public link. */
  tourSlug: string | null;
  /** Originating page or component (e.g. "/tours/cox-bazar", "tour-booking-card"). */
  source: string | null;
  /** Captured client IP address used for fraud/spam analysis. */
  ipAddress: string | null;
  /** Browser user-agent captured at submission time. */
  userAgent: string | null;
  /** Optional admin notes for follow-up. */
  notes: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type BookingCreationAttributes = Optional<
  BookingAttributes,
  | 'id'
  | 'email'
  | 'bookingDate'
  | 'status'
  | 'serviceType'
  | 'serviceTitle'
  | 'details'
  | 'tourId'
  | 'tourTitle'
  | 'tourSlug'
  | 'source'
  | 'ipAddress'
  | 'userAgent'
  | 'notes'
>;

class Booking
  extends Model<BookingAttributes, BookingCreationAttributes>
  implements BookingAttributes
{
  declare id: number;
  declare name: string;
  declare phone: string;
  declare email: string | null;
  declare bookingDate: Date | null;
  declare message: string;
  declare status: BookingStatus;
  declare serviceType: BookingServiceType;
  declare serviceTitle: string | null;
  declare details: Record<string, unknown> | null;
  declare tourId: number | null;
  declare tourTitle: string | null;
  declare tourSlug: string | null;
  declare source: string | null;
  declare ipAddress: string | null;
  declare userAgent: string | null;
  declare notes: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Booking.init(
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
    phone: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    bookingDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    status: {
      type: DataTypes.ENUM('New', 'Contacted', 'Confirmed', 'Cancelled'),
      allowNull: false,
      defaultValue: 'New',
    },
    serviceType: {
      type: DataTypes.ENUM('tour', 'ticket', 'visa', 'resort', 'general'),
      allowNull: false,
      defaultValue: 'general',
    },
    serviceTitle: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    details: {
      type: DataTypes.JSON,
      allowNull: true,
      get() {
        const raw = this.getDataValue('details') as unknown;
        if (raw === null || raw === undefined) return null;
        if (typeof raw === 'string') {
          try {
            return JSON.parse(raw) as Record<string, unknown>;
          } catch {
            return null;
          }
        }
        return raw as Record<string, unknown>;
      },
    },
    tourId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: Tour,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    tourTitle: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    tourSlug: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    source: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ipAddress: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    userAgent: {
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
    tableName: 'bookings',
    timestamps: true,
    indexes: [
      { fields: ['email'] },
      { fields: ['phone'] },
      { fields: ['ipAddress'] },
      { fields: ['tourId'] },
      { fields: ['serviceType'] },
      { fields: ['createdAt'] },
    ],
  }
);

Booking.belongsTo(Tour, { foreignKey: 'tourId', as: 'Tour' });
Tour.hasMany(Booking, { foreignKey: 'tourId' });

export default Booking;
