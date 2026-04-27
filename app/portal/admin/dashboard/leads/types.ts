export type BookingStatus = 'New' | 'Contacted' | 'Confirmed' | 'Cancelled';

export type BookingServiceType = 'tour' | 'ticket' | 'visa' | 'resort' | 'general';

export interface BookingTourSummary {
  id: number;
  title: string;
  slug: string | null;
}

export interface BookingRecord {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  bookingDate: string | null;
  message: string;
  status: BookingStatus;
  serviceType: BookingServiceType;
  serviceTitle: string | null;
  details: Record<string, unknown> | null;
  tourId: number | null;
  tourTitle: string | null;
  tourSlug: string | null;
  Tour?: BookingTourSummary | null;
  source: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export const BOOKING_SERVICE_OPTIONS: { value: BookingServiceType; label: string; emoji: string }[] = [
  { value: 'tour', label: 'Tour', emoji: '🌴' },
  { value: 'ticket', label: 'Flight Ticket', emoji: '✈️' },
  { value: 'visa', label: 'Visa', emoji: '🛂' },
  { value: 'resort', label: 'Resort', emoji: '🏝️' },
  { value: 'general', label: 'General', emoji: '📨' },
];

export interface TourLite {
  id: number;
  title: string;
  slug: string | null;
  status?: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Converted' | 'Spam' | 'Closed';

export interface LeadRecord {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  pageUrl: string | null;
  status: LeadStatus;
  ipAddress: string | null;
  userAgent: string | null;
  referrer: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export const BOOKING_STATUS_OPTIONS: BookingStatus[] = [
  'New',
  'Contacted',
  'Confirmed',
  'Cancelled',
];

export const LEAD_STATUS_OPTIONS: LeadStatus[] = [
  'New',
  'Contacted',
  'Converted',
  'Spam',
  'Closed',
];

export type BookingActivityType =
  | 'note'
  | 'status_change'
  | 'call'
  | 'email'
  | 'sms'
  | 'whatsapp'
  | 'meeting'
  | 'system';

export interface BookingActivityRecord {
  id: number;
  bookingId: number;
  type: BookingActivityType;
  body: string;
  meta: Record<string, unknown> | null;
  authorEmail: string | null;
  authorLabel: string | null;
  createdAt: string;
  updatedAt: string;
}

export const BOOKING_ACTIVITY_TYPES: { value: BookingActivityType; label: string }[] = [
  { value: 'note', label: 'Internal note' },
  { value: 'call', label: 'Phone call' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'meeting', label: 'Meeting' },
];

export interface BookingDetailTour {
  id: number;
  title: string;
  slug: string | null;
  location: string | null;
  price: number | null;
  duration: string | null;
  image: string | null;
}

export interface BookingDetailRecord extends Omit<BookingRecord, 'Tour'> {
  Tour?: BookingDetailTour | null;
}

export interface BookingRelatedSummary {
  id: number;
  name: string;
  phone?: string;
  email: string | null;
  status: BookingStatus;
  serviceType?: BookingServiceType;
  serviceTitle?: string | null;
  tourTitle?: string | null;
  tourSlug?: string | null;
  ipAddress?: string | null;
  createdAt: string;
}

export interface BookingRelatedLead {
  id: number;
  name: string;
  email: string;
  source: string;
  pageUrl: string | null;
  status: LeadStatus;
  createdAt: string;
}

export interface BookingRiskSummary {
  score: 'low' | 'medium' | 'high';
  weight: number;
  windowDays: number;
  ipCount: number;
  emailCount: number;
  phoneCount: number;
}

export interface BookingDetailResponse {
  booking: BookingDetailRecord;
  activities: BookingActivityRecord[];
  related: {
    sameEmail: BookingRelatedSummary[];
    samePhone: BookingRelatedSummary[];
    sameIp: BookingRelatedSummary[];
    leads: BookingRelatedLead[];
  };
  risk: BookingRiskSummary;
}
