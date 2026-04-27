import { NextRequest, NextResponse } from 'next/server';
import { Op } from 'sequelize';
import sequelize from '@/src/lib/db';
import { verifyAuth } from '@/src/lib/auth';
import Booking from '@/src/models/Booking';
import BookingActivity from '@/src/models/BookingActivity';
import Lead from '@/src/models/Lead';
import Tour from '@/src/models/Tour';

export const dynamic = 'force-dynamic';

interface Params {
  params: Promise<{ id: string }>;
}

const RELATED_LIMIT = 5;
const RISK_WINDOW_DAYS = 30;

const tourInclude = {
  model: Tour,
  as: 'Tour' as const,
  attributes: ['id', 'title', 'slug', 'location', 'price', 'duration', 'image'],
  required: false,
};

function startOfWindow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

function riskLevel(scores: { ipCount: number; emailCount: number; phoneCount: number }) {
  const max = Math.max(scores.ipCount, scores.emailCount, scores.phoneCount);
  if (max >= 8) return { score: 'high' as const, weight: max };
  if (max >= 4) return { score: 'medium' as const, weight: max };
  return { score: 'low' as const, weight: max };
}

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const auth = await verifyAuth();
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    await sequelize.authenticate();

    const booking = await Booking.findByPk(id, { include: [tourInclude] });
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const plain = booking.get({ plain: true });

    const activitiesPromise = BookingActivity.findAll({
      where: { bookingId: booking.id },
      order: [['createdAt', 'DESC']],
      limit: 200,
    });

    const sinceDate = startOfWindow(RISK_WINDOW_DAYS);

    const relatedAttributes = [
      'id',
      'name',
      'phone',
      'email',
      'status',
      'serviceType',
      'serviceTitle',
      'tourTitle',
      'tourSlug',
      'createdAt',
    ];

    const sameEmailPromise = booking.email
      ? Booking.findAll({
          where: { email: booking.email, id: { [Op.ne]: booking.id } },
          attributes: relatedAttributes,
          order: [['createdAt', 'DESC']],
          limit: RELATED_LIMIT,
        })
      : Promise.resolve([]);

    const samePhonePromise = booking.phone
      ? Booking.findAll({
          where: { phone: booking.phone, id: { [Op.ne]: booking.id } },
          attributes: relatedAttributes,
          order: [['createdAt', 'DESC']],
          limit: RELATED_LIMIT,
        })
      : Promise.resolve([]);

    const sameIpPromise = booking.ipAddress
      ? Booking.findAll({
          where: { ipAddress: booking.ipAddress, id: { [Op.ne]: booking.id } },
          attributes: [...relatedAttributes, 'ipAddress'],
          order: [['createdAt', 'DESC']],
          limit: RELATED_LIMIT,
        })
      : Promise.resolve([]);

    const ipCountPromise = booking.ipAddress
      ? Booking.count({
          where: { ipAddress: booking.ipAddress, createdAt: { [Op.gte]: sinceDate } },
        })
      : Promise.resolve(0);

    const emailCountPromise = booking.email
      ? Booking.count({
          where: { email: booking.email, createdAt: { [Op.gte]: sinceDate } },
        })
      : Promise.resolve(0);

    const phoneCountPromise = booking.phone
      ? Booking.count({
          where: { phone: booking.phone, createdAt: { [Op.gte]: sinceDate } },
        })
      : Promise.resolve(0);

    const matchingLeadsPromise = booking.email
      ? Lead.findAll({
          where: { email: booking.email },
          attributes: ['id', 'name', 'email', 'source', 'pageUrl', 'status', 'createdAt'],
          order: [['createdAt', 'DESC']],
          limit: RELATED_LIMIT,
        })
      : Promise.resolve([]);

    const [
      activities,
      sameEmail,
      samePhone,
      sameIp,
      ipCount,
      emailCount,
      phoneCount,
      matchingLeads,
    ] = await Promise.all([
      activitiesPromise,
      sameEmailPromise,
      samePhonePromise,
      sameIpPromise,
      ipCountPromise,
      emailCountPromise,
      phoneCountPromise,
      matchingLeadsPromise,
    ]);

    const risk = riskLevel({ ipCount, emailCount, phoneCount });

    return NextResponse.json({
      booking: plain,
      activities: activities.map((a) => a.get({ plain: true })),
      related: {
        sameEmail: sameEmail.map((r) => r.get({ plain: true })),
        samePhone: samePhone.map((r) => r.get({ plain: true })),
        sameIp: sameIp.map((r) => r.get({ plain: true })),
        leads: matchingLeads.map((r) => r.get({ plain: true })),
      },
      risk: {
        score: risk.score,
        weight: risk.weight,
        windowDays: RISK_WINDOW_DAYS,
        ipCount,
        emailCount,
        phoneCount,
      },
    });
  } catch (error) {
    console.error('Error loading booking detail:', error);
    return NextResponse.json({ error: 'Failed to load booking detail' }, { status: 500 });
  }
}
