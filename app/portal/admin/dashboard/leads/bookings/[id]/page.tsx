"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
    Alert,
    App,
    Avatar,
    Button,
    Card,
    Empty,
    Image as AntImage,
    Input,
    Popconfirm,
    Segmented,
    Select,
    Skeleton,
    Space,
    Tag,
    Timeline,
    Tooltip,
    Typography,
} from "antd";
import {
    ArrowLeftOutlined,
    CalendarOutlined,
    CheckCircleTwoTone,
    ClockCircleOutlined,
    CommentOutlined,
    CopyOutlined,
    DeleteOutlined,
    EditOutlined,
    EnvironmentOutlined,
    ExclamationCircleTwoTone,
    FileSearchOutlined,
    GlobalOutlined,
    LinkOutlined,
    MailOutlined,
    MessageOutlined,
    PauseCircleTwoTone,
    PhoneOutlined,
    PlusOutlined,
    ReloadOutlined,
    SafetyCertificateTwoTone,
    SaveOutlined,
    StopOutlined,
    TeamOutlined,
    UserOutlined,
    WarningTwoTone,
    WhatsAppOutlined,
} from "@ant-design/icons";
import BookingFormModal from "../../components/BookingFormModal";
import {
    BOOKING_ACTIVITY_TYPES,
    BOOKING_SERVICE_OPTIONS,
    BOOKING_STATUS_OPTIONS,
    BookingActivityRecord,
    BookingActivityType,
    BookingDetailResponse,
    BookingRecord,
    BookingServiceType,
    BookingStatus,
} from "../../types";

function serviceMeta(type: BookingServiceType) {
    return (
        BOOKING_SERVICE_OPTIONS.find((s) => s.value === type) ??
        BOOKING_SERVICE_OPTIONS[BOOKING_SERVICE_OPTIONS.length - 1]
    );
}

function serviceTagColor(type: BookingServiceType): string {
    switch (type) {
        case "tour":
            return "green";
        case "ticket":
            return "geekblue";
        case "visa":
            return "purple";
        case "resort":
            return "magenta";
        default:
            return "default";
    }
}

function humanizeDetailKey(key: string): string {
    return key
        .replace(/[_-]+/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

function detailValuePreview(value: unknown): string {
    if (value === null || value === undefined) return "—";
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    try {
        return JSON.stringify(value);
    } catch {
        return String(value);
    }
}

/**
 * MySQL/Sequelize sometimes returns a JSON column as the raw stringified text
 * instead of an object. Parse it back so `Object.entries` iterates real keys
 * instead of each character of the string.
 */
function normalizeDetails(value: unknown): Record<string, unknown> | null {
    if (value === null || value === undefined) return null;
    if (typeof value === "string") {
        const trimmed = value.trim();
        if (!trimmed) return null;
        try {
            const parsed = JSON.parse(trimmed);
            return parsed && typeof parsed === "object" && !Array.isArray(parsed)
                ? (parsed as Record<string, unknown>)
                : null;
        } catch {
            return null;
        }
    }
    if (typeof value === "object" && !Array.isArray(value)) {
        return value as Record<string, unknown>;
    }
    return null;
}

const { Title, Text, Paragraph } = Typography;

function fmtDate(value: string | Date | null | undefined, withTime = false) {
    if (!value) return "—";
    const d = typeof value === "string" ? new Date(value) : value;
    if (Number.isNaN(d.getTime())) return "—";
    return withTime
        ? d.toLocaleString()
        : d.toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
          });
}

function relativeTime(value: string | Date) {
    const d = typeof value === "string" ? new Date(value) : value;
    if (Number.isNaN(d.getTime())) return "";
    const diff = Date.now() - d.getTime();
    if (diff < 0) return "just now";
    const s = Math.floor(diff / 1000);
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const days = Math.floor(h / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
}

function statusBg(status: BookingStatus): string {
    switch (status) {
        case "Confirmed":
            return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
        case "Contacted":
            return "bg-blue-50 text-blue-700 ring-1 ring-blue-200";
        case "Cancelled":
            return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
        default:
            return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
    }
}

function activityIcon(type: BookingActivityType) {
    switch (type) {
        case "status_change":
            return <CheckCircleTwoTone twoToneColor="#16a34a" />;
        case "call":
            return <PhoneOutlined style={{ color: "#0ea5e9" }} />;
        case "whatsapp":
            return <WhatsAppOutlined style={{ color: "#22c55e" }} />;
        case "email":
            return <MailOutlined style={{ color: "#6366f1" }} />;
        case "sms":
            return <MessageOutlined style={{ color: "#f59e0b" }} />;
        case "meeting":
            return <TeamOutlined style={{ color: "#a855f7" }} />;
        case "system":
            return <SafetyCertificateTwoTone twoToneColor="#64748b" />;
        case "note":
        default:
            return <CommentOutlined style={{ color: "#475569" }} />;
    }
}

function activityLabel(type: BookingActivityType) {
    const found = BOOKING_ACTIVITY_TYPES.find((t) => t.value === type);
    if (found) return found.label;
    if (type === "status_change") return "Status change";
    if (type === "system") return "System";
    return type;
}

function whatsappHref(phone: string, name: string, tour: string | null) {
    const digits = phone.replace(/\D/g, "");
    const text = encodeURIComponent(
        `Hi ${name}, this is Sun Tourism following up on your${tour ? ` "${tour}"` : ""} booking inquiry.`
    );
    return `https://wa.me/${digits}?text=${text}`;
}

function copyValue(
    value: string | null | undefined,
    label: string,
    messageApi: ReturnType<typeof App.useApp>["message"]
) {
    if (!value) return;
    navigator.clipboard
        .writeText(value)
        .then(() => messageApi.success(`${label} copied`))
        .catch(() => messageApi.error(`Could not copy ${label.toLowerCase()}`));
}

function RiskBadge({ score }: { score: "low" | "medium" | "high" }) {
    const styles =
        score === "high"
            ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
            : score === "medium"
                ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    const icon =
        score === "high" ? (
            <WarningTwoTone twoToneColor="#dc2626" />
        ) : score === "medium" ? (
            <ExclamationCircleTwoTone twoToneColor="#f59e0b" />
        ) : (
            <SafetyCertificateTwoTone twoToneColor="#16a34a" />
        );
    const label = score === "high" ? "High risk" : score === "medium" ? "Medium risk" : "Low risk";
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles}`}
        >
            {icon}
            {label}
        </span>
    );
}

function SectionTitle({
    icon,
    title,
    extra,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    extra?: React.ReactNode;
    description?: string;
}) {
    return (
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <div className="flex items-center gap-2">
                    <span className="text-base text-slate-500">{icon}</span>
                    <Title level={5} style={{ margin: 0 }}>
                        {title}
                    </Title>
                </div>
                {description ? (
                    <Text type="secondary" className="text-xs">
                        {description}
                    </Text>
                ) : null}
            </div>
            {extra ? <div>{extra}</div> : null}
        </div>
    );
}

function MetricTile({
    icon,
    label,
    value,
    accent,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    accent: "blue" | "emerald" | "amber" | "violet";
}) {
    const accentMap = {
        blue: "bg-blue-50 text-blue-600 ring-blue-100",
        emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
        amber: "bg-amber-50 text-amber-600 ring-amber-100",
        violet: "bg-violet-50 text-violet-600 ring-violet-100",
    } as const;
    return (
        <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ring-1 ${accentMap[accent]}`}
            >
                {icon}
            </span>
            <div className="min-w-0 flex-1">
                <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    {label}
                </div>
                <div className="truncate text-sm font-semibold text-slate-800">{value}</div>
            </div>
        </div>
    );
}

function MetaRow({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-start justify-between gap-4 py-2 text-sm">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {label}
            </span>
            <span className="text-right text-slate-700">{children}</span>
        </div>
    );
}

export default function BookingDetailPage() {
    const { message } = App.useApp();
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const bookingId = params?.id;

    const [data, setData] = useState<BookingDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [savingStatus, setSavingStatus] = useState(false);
    const [savingNotes, setSavingNotes] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [notes, setNotes] = useState("");
    const [activityType, setActivityType] = useState<BookingActivityType>("note");
    const [activityBody, setActivityBody] = useState("");
    const [submittingActivity, setSubmittingActivity] = useState(false);

    const refresh = useCallback(async () => {
        if (!bookingId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/bookings/${bookingId}/details`, {
                cache: "no-store",
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.error || "Failed to load booking");
            setData(json as BookingDetailResponse);
            setNotes((json as BookingDetailResponse).booking.notes ?? "");
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load booking");
        } finally {
            setLoading(false);
        }
    }, [bookingId]);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    const booking = data?.booking;

    const tourLabel = useMemo(() => {
        if (!booking) return null;
        return booking.Tour?.title || booking.tourTitle || null;
    }, [booking]);

    const tourId = booking?.Tour?.id ?? booking?.tourId ?? null;

    const handleStatus = async (next: BookingStatus) => {
        if (!booking) return;
        if (next === booking.status) return;
        setSavingStatus(true);
        try {
            const res = await fetch(`/api/bookings/${booking.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: next }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.error || "Failed to update status");
            message.success(`Status updated to ${next}`);
            await refresh();
        } catch (e) {
            if (e instanceof Error) message.error(e.message);
        } finally {
            setSavingStatus(false);
        }
    };

    const handleSaveNotes = async () => {
        if (!booking) return;
        setSavingNotes(true);
        try {
            const res = await fetch(`/api/bookings/${booking.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notes }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.error || "Failed to save notes");
            message.success("Notes saved");
            setData((prev) =>
                prev
                    ? {
                          ...prev,
                          booking: { ...prev.booking, notes: (json as BookingRecord).notes ?? null },
                      }
                    : prev
            );
        } catch (e) {
            if (e instanceof Error) message.error(e.message);
        } finally {
            setSavingNotes(false);
        }
    };

    const handleAddActivity = async () => {
        if (!booking) return;
        const trimmed = activityBody.trim();
        if (!trimmed) {
            message.warning("Add a short note before saving");
            return;
        }
        setSubmittingActivity(true);
        try {
            const res = await fetch(`/api/bookings/${booking.id}/activities`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: activityType, body: trimmed }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.error || "Failed to add activity");
            const created = json as BookingActivityRecord;
            setData((prev) =>
                prev ? { ...prev, activities: [created, ...prev.activities] } : prev
            );
            setActivityBody("");
            message.success("Activity logged");
        } catch (e) {
            if (e instanceof Error) message.error(e.message);
        } finally {
            setSubmittingActivity(false);
        }
    };

    const handleDeleteActivity = async (activityId: number) => {
        if (!booking) return;
        try {
            const res = await fetch(
                `/api/bookings/${booking.id}/activities/${activityId}`,
                { method: "DELETE" }
            );
            const json = await res.json();
            if (!res.ok) throw new Error(json?.error || "Failed to delete activity");
            setData((prev) =>
                prev
                    ? { ...prev, activities: prev.activities.filter((a) => a.id !== activityId) }
                    : prev
            );
            message.success("Activity removed");
        } catch (e) {
            if (e instanceof Error) message.error(e.message);
        }
    };

    const handleDelete = async () => {
        if (!booking) return;
        try {
            const res = await fetch(`/api/bookings/${booking.id}`, { method: "DELETE" });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.error || "Failed to delete booking");
            message.success("Booking deleted");
            router.push("/portal/admin/dashboard/leads");
        } catch (e) {
            if (e instanceof Error) message.error(e.message);
        }
    };

    if (!bookingId) {
        return <Alert type="error" title="Missing booking id" />;
    }

    if (loading && !data) {
        return (
            <div className="space-y-6">
                <Skeleton.Button active size="small" />
                <Card variant="borderless" className="rounded-2xl shadow-sm">
                    <Skeleton active avatar paragraph={{ rows: 3 }} />
                </Card>
                <Card variant="borderless" className="rounded-2xl shadow-sm">
                    <Skeleton active paragraph={{ rows: 5 }} />
                </Card>
            </div>
        );
    }

    if (error && !data) {
        return (
            <div className="space-y-4">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => router.push("/portal/admin/dashboard/leads")}
                >
                    Back to Leads
                </Button>
                <Alert
                    type="error"
                    showIcon
                    title="Couldn't load this booking"
                    description={error}
                    action={
                        <Button onClick={() => void refresh()} icon={<ReloadOutlined />}>
                            Retry
                        </Button>
                    }
                />
            </div>
        );
    }

    if (!data || !booking) return null;

    const { activities, related, risk } = data;
    const totalRelated =
        related.sameEmail.length + related.samePhone.length + related.sameIp.length;
    const tour = booking.Tour ?? null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => router.push("/portal/admin/dashboard/leads")}
                    className="!px-2 !text-slate-500 hover:!text-slate-900"
                >
                    Back to Leads
                </Button>
                <Text type="secondary" className="text-xs">
                    Booking #{booking.id}
                </Text>
            </div>

            {/* HERO */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)]">
                <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-32 bg-gradient-to-br from-sky-500/10 via-indigo-500/10 to-purple-500/10"
                />
                <div className="relative px-6 pb-6 pt-8 md:px-8 md:pt-10">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <Avatar
                                size={68}
                                style={{
                                    background:
                                        "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
                                    fontSize: 26,
                                    fontWeight: 600,
                                    boxShadow:
                                        "0 6px 16px -6px rgba(99,102,241,0.5), 0 1px 3px rgba(15,23,42,0.08)",
                                }}
                            >
                                {(booking.name || "?").charAt(0).toUpperCase()}
                            </Avatar>
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Title level={2} style={{ margin: 0, lineHeight: 1.15 }}>
                                        {booking.name}
                                    </Title>
                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${statusBg(booking.status)}`}
                                    >
                                        {booking.status}
                                    </span>
                                    <RiskBadge score={risk.score} />
                                </div>
                                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                                    <span className="inline-flex items-center gap-1">
                                        <ClockCircleOutlined />
                                        Created {fmtDate(booking.createdAt, true)} · {relativeTime(booking.createdAt)}
                                    </span>
                                    {tourLabel ? (
                                        <span className="inline-flex items-center gap-1 truncate">
                                            <EnvironmentOutlined />
                                            {tourLabel}
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        <Space wrap>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={() => void refresh()}
                                loading={loading}
                            >
                                Refresh
                            </Button>
                            <Button icon={<EditOutlined />} onClick={() => setEditOpen(true)}>
                                Edit
                            </Button>
                            <Popconfirm
                                title="Delete this booking?"
                                description="This action cannot be undone."
                                okText="Delete"
                                okButtonProps={{ danger: true }}
                                cancelText="Cancel"
                                onConfirm={() => void handleDelete()}
                            >
                                <Button danger icon={<DeleteOutlined />}>
                                    Delete
                                </Button>
                            </Popconfirm>
                        </Space>
                    </div>

                    {/* Quick contact */}
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <a
                            href={`tel:${booking.phone}`}
                            className="group flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 transition hover:border-sky-300 hover:shadow-sm"
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-100">
                                <PhoneOutlined />
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                    Phone
                                </div>
                                <div className="truncate text-sm font-semibold text-slate-800 group-hover:text-sky-700">
                                    {booking.phone}
                                </div>
                            </div>
                            <Tooltip title="Copy">
                                <button
                                    type="button"
                                    className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        copyValue(booking.phone, "Phone", message);
                                    }}
                                >
                                    <CopyOutlined />
                                </button>
                            </Tooltip>
                        </a>
                        {booking.email ? (
                            <a
                                href={`mailto:${booking.email}`}
                                className="group flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 transition hover:border-indigo-300 hover:shadow-sm"
                            >
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                                    <MailOutlined />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                        Email
                                    </div>
                                    <div className="truncate text-sm font-semibold text-slate-800 group-hover:text-indigo-700">
                                        {booking.email}
                                    </div>
                                </div>
                                <Tooltip title="Copy">
                                    <button
                                        type="button"
                                        className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            copyValue(booking.email, "Email", message);
                                        }}
                                    >
                                        <CopyOutlined />
                                    </button>
                                </Tooltip>
                            </a>
                        ) : (
                            <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-400">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400 ring-1 ring-slate-200">
                                    <MailOutlined />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                        Email
                                    </div>
                                    <div className="text-sm font-medium">
                                        Not provided
                                    </div>
                                </div>
                            </div>
                        )}
                        <a
                            href={whatsappHref(booking.phone, booking.name, tourLabel)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 transition hover:border-emerald-300 hover:shadow-sm"
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                                <WhatsAppOutlined />
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                    WhatsApp
                                </div>
                                <div className="truncate text-sm font-semibold text-slate-800 group-hover:text-emerald-700">
                                    Open chat
                                </div>
                            </div>
                            <span className="text-slate-300 transition group-hover:text-emerald-500">
                                <LinkOutlined />
                            </span>
                        </a>
                    </div>

                    {/* KPIs */}
                    <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                        <MetricTile
                            icon={<CalendarOutlined />}
                            label="Booking date"
                            value={booking.bookingDate ? fmtDate(booking.bookingDate) : "Not set"}
                            accent="blue"
                        />
                        <MetricTile
                            icon={<EnvironmentOutlined />}
                            label="Tour package"
                            value={tourLabel ?? "General inquiry"}
                            accent="emerald"
                        />
                        <MetricTile
                            icon={<GlobalOutlined />}
                            label="Source"
                            value={booking.source || "—"}
                            accent="violet"
                        />
                        <MetricTile
                            icon={<TeamOutlined />}
                            label="Related submissions"
                            value={totalRelated}
                            accent="amber"
                        />
                    </div>
                </div>
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main column */}
                <div className="space-y-6 lg:col-span-2">
                    {(() => {
                        const bd = booking.bookingDate;
                        const parsed = bd ? new Date(bd) : null;
                        const valid = parsed && !Number.isNaN(parsed.getTime());
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const target = valid ? new Date(parsed!) : null;
                        if (target) target.setHours(0, 0, 0, 0);
                        const diffDays =
                            valid && target
                                ? Math.round(
                                      (target.getTime() - today.getTime()) /
                                          (1000 * 60 * 60 * 24)
                                  )
                                : null;
                        const niceDate = valid
                            ? parsed!.toLocaleDateString(undefined, {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                              })
                            : null;
                        const tone =
                            diffDays === null
                                ? "slate"
                                : diffDays < 0
                                  ? "rose"
                                  : diffDays <= 7
                                    ? "amber"
                                    : "indigo";
                        const toneRing: Record<string, string> = {
                            slate: "border-slate-200 bg-slate-50",
                            rose: "border-rose-200 bg-rose-50",
                            amber: "border-amber-200 bg-amber-50",
                            indigo: "border-indigo-200 bg-indigo-50",
                        };
                        const toneIcon: Record<string, string> = {
                            slate: "bg-white text-slate-500 ring-slate-200",
                            rose: "bg-white text-rose-600 ring-rose-200",
                            amber: "bg-white text-amber-600 ring-amber-200",
                            indigo: "bg-white text-indigo-600 ring-indigo-200",
                        };
                        const toneText: Record<string, string> = {
                            slate: "text-slate-700",
                            rose: "text-rose-700",
                            amber: "text-amber-800",
                            indigo: "text-indigo-700",
                        };
                        const helper = !valid
                            ? "Customer didn't pick a preferred date — confirm before contacting."
                            : diffDays === 0
                              ? "Travel is today."
                              : diffDays === 1
                                ? "Travel is tomorrow."
                                : diffDays! < 0
                                  ? `Travel was ${Math.abs(diffDays!)} day${Math.abs(diffDays!) === 1 ? "" : "s"} ago.`
                                  : `In ${diffDays} day${diffDays === 1 ? "" : "s"}.`;
                        return (
                            <div
                                className={`flex flex-col gap-3 rounded-2xl border px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${toneRing[tone]}`}
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${toneIcon[tone]}`}
                                    >
                                        <CalendarOutlined style={{ fontSize: 18 }} />
                                    </span>
                                    <div>
                                        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                                            Preferred booking date
                                        </div>
                                        <div
                                            className={`mt-0.5 text-base font-semibold ${toneText[tone]}`}
                                        >
                                            {niceDate ?? "Not specified"}
                                        </div>
                                        <div className="mt-0.5 text-xs text-slate-500">
                                            {helper}
                                        </div>
                                    </div>
                                </div>
                                {valid ? (
                                    <Tag
                                        color={
                                            tone === "rose"
                                                ? "red"
                                                : tone === "amber"
                                                  ? "orange"
                                                  : "blue"
                                        }
                                        className="!m-0 !rounded-full !px-3 !py-1 text-sm font-semibold"
                                    >
                                        {diffDays! < 0
                                            ? "Past"
                                            : diffDays === 0
                                              ? "Today"
                                              : diffDays! <= 7
                                                ? `${diffDays}d away`
                                                : `${diffDays}d away`}
                                    </Tag>
                                ) : (
                                    <Tag className="!m-0 !rounded-full !px-3 !py-1">
                                        Date not set
                                    </Tag>
                                )}
                            </div>
                        );
                    })()}

                    <Card
                        variant="borderless"
                        className="rounded-2xl shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                        styles={{ body: { padding: 24 } }}
                    >
                        <SectionTitle
                            icon={<CommentOutlined />}
                            title="Customer message"
                            description="What the customer wrote when submitting the booking."
                        />
                        {booking.message ? (
                            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                                <Paragraph
                                    style={{
                                        whiteSpace: "pre-line",
                                        margin: 0,
                                        color: "#1e293b",
                                        lineHeight: 1.7,
                                    }}
                                >
                                    {booking.message}
                                </Paragraph>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-10 text-center">
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={
                                        <span className="text-slate-500">No message provided</span>
                                    }
                                />
                            </div>
                        )}
                    </Card>

                    <Card
                        variant="borderless"
                        className="rounded-2xl shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                        styles={{ body: { padding: 24 } }}
                    >
                        <SectionTitle
                            icon={<ClockCircleOutlined />}
                            title="Activity timeline"
                            description="Auto-logged audit events plus any manual follow-ups your team adds."
                            extra={
                                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                                    {activities.length}{" "}
                                    {activities.length === 1 ? "entry" : "entries"}
                                </span>
                            }
                        />

                        {/* Composer */}
                        <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                            <Segmented
                                size="small"
                                value={activityType}
                                onChange={(val) => setActivityType(val as BookingActivityType)}
                                options={BOOKING_ACTIVITY_TYPES.map((t) => ({
                                    label: t.label,
                                    value: t.value,
                                }))}
                                block
                            />
                            <Input.TextArea
                                value={activityBody}
                                onChange={(e) => setActivityBody(e.target.value)}
                                placeholder={
                                    activityType === "note"
                                        ? "Internal note for the team…"
                                        : `Log a quick summary of the ${activityLabel(activityType).toLowerCase()}…`
                                }
                                autoSize={{ minRows: 3, maxRows: 8 }}
                                maxLength={2000}
                                showCount
                                className="mt-3"
                                style={{ borderRadius: 12, marginBottom: 15 }}
                            />
                            <div className="mt-3 flex items-center justify-between">
                                <Text type="secondary" className="text-xs">
                                    Visible to admins only.
                                </Text>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    loading={submittingActivity}
                                    onClick={() => void handleAddActivity()}
                                >
                                    Log {activityLabel(activityType).toLowerCase()}
                                </Button>
                            </div>
                        </div>

                        {activities.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-10 text-center">
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={
                                        <span className="text-slate-500">
                                            No activity yet — add the first follow-up note above.
                                        </span>
                                    }
                                />
                            </div>
                        ) : (
                            <Timeline
                                items={activities.map((a) => ({
                                    icon: (
                                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-base ring-1 ring-slate-200">
                                            {activityIcon(a.type)}
                                        </span>
                                    ),
                                    content: (
                                        <div className="-mt-1 ml-1 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Text strong className="text-slate-800">
                                                        {activityLabel(a.type)}
                                                    </Text>
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
                                                        <UserOutlined />
                                                        {a.authorLabel || a.authorEmail || "System"}
                                                    </span>
                                                    <Tooltip title={fmtDate(a.createdAt, true)}>
                                                        <span className="text-[11px] text-slate-400">
                                                            {relativeTime(a.createdAt)}
                                                        </span>
                                                    </Tooltip>
                                                </div>
                                                {a.type !== "status_change" && a.type !== "system" ? (
                                                    <Popconfirm
                                                        title="Remove this activity?"
                                                        okText="Remove"
                                                        cancelText="Cancel"
                                                        okButtonProps={{ danger: true }}
                                                        onConfirm={() =>
                                                            void handleDeleteActivity(a.id)
                                                        }
                                                    >
                                                        <Button
                                                            type="text"
                                                            size="small"
                                                            icon={<DeleteOutlined />}
                                                            danger
                                                        />
                                                    </Popconfirm>
                                                ) : null}
                                            </div>
                                            <Paragraph
                                                className="mt-2"
                                                style={{
                                                    whiteSpace: "pre-line",
                                                    marginBottom: 0,
                                                    color: "#334155",
                                                    lineHeight: 1.6,
                                                }}
                                            >
                                                {a.body}
                                            </Paragraph>
                                        </div>
                                    ),
                                }))}
                            />
                        )}
                    </Card>

                    {tour ? (
                        <Card
                            variant="borderless"
                            className="rounded-2xl shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                            styles={{ body: { padding: 24 } }}
                        >
                            <SectionTitle
                                icon={<EnvironmentOutlined />}
                                title="Tour package"
                                description="The package this customer is asking about."
                                extra={
                                    <Space>
                                        <Link href={`/portal/admin/dashboard/tours/${tour.id}`}>
                                            <Button size="small" icon={<EditOutlined />}>
                                                Edit tour
                                            </Button>
                                        </Link>
                                        {tour.slug ? (
                                            <a
                                                href={`/tours/${tour.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Button size="small" icon={<LinkOutlined />}>
                                                    View public
                                                </Button>
                                            </a>
                                        ) : null}
                                    </Space>
                                }
                            />
                            <div className="flex flex-col gap-5 sm:flex-row">
                                {tour.image ? (
                                    <div className="overflow-hidden rounded-2xl ring-1 ring-slate-200">
                                        <AntImage
                                            src={tour.image}
                                            alt={tour.title}
                                            width={200}
                                            height={140}
                                            style={{ objectFit: "cover", display: "block" }}
                                            preview={false}
                                        />
                                    </div>
                                ) : null}
                                <div className="flex-1 space-y-3">
                                    <Title level={4} style={{ margin: 0 }}>
                                        {tour.title}
                                    </Title>
                                    <Space wrap size={[6, 6]}>
                                        {tour.location ? (
                                            <Tag
                                                icon={<EnvironmentOutlined />}
                                                className="!rounded-full"
                                            >
                                                {tour.location}
                                            </Tag>
                                        ) : null}
                                        {tour.duration ? (
                                            <Tag className="!rounded-full">{tour.duration}</Tag>
                                        ) : null}
                                        {typeof tour.price === "number" ? (
                                            <Tag color="green" className="!rounded-full">
                                                ৳ {tour.price.toLocaleString()}
                                            </Tag>
                                        ) : null}
                                    </Space>
                                    {booking.tourSlug ? (
                                        <Text type="secondary" className="block text-xs">
                                            /tours/{booking.tourSlug}
                                        </Text>
                                    ) : null}
                                </div>
                            </div>
                        </Card>
                    ) : tourLabel ? (
                        <Card
                            variant="borderless"
                            className="rounded-2xl shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                            styles={{ body: { padding: 24 } }}
                        >
                            <SectionTitle icon={<EnvironmentOutlined />} title="Tour package" />
                            <Alert
                                type="warning"
                                showIcon
                                className="!rounded-2xl"
                                title="Snapshot only"
                                description={
                                    <span>
                                        The original tour was deleted or is no longer linked. Snapshot kept:{" "}
                                        <Text strong>{tourLabel}</Text>
                                        {booking.tourSlug ? (
                                            <span className="block text-xs text-gray-500">
                                                /tours/{booking.tourSlug}
                                            </span>
                                        ) : null}
                                    </span>
                                }
                            />
                        </Card>
                    ) : null}

                    {(() => {
                        const parsedDetails = normalizeDetails(booking.details);
                        const detailEntries = parsedDetails
                            ? Object.entries(parsedDetails).filter(
                                  ([, v]) => v !== null && v !== undefined && v !== ""
                              )
                            : [];
                        const showCard =
                            booking.serviceType !== "tour" ||
                            !!booking.serviceTitle ||
                            detailEntries.length > 0;
                        if (!showCard) return null;
                        return (
                            <Card
                                variant="borderless"
                                className="rounded-2xl shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                                styles={{ body: { padding: 24 } }}
                            >
                                <SectionTitle
                                    icon={<FileSearchOutlined />}
                                    title="Service request"
                                    description="What this customer asked about and any context captured at submission time."
                                    extra={
                                        <Tag
                                            color={serviceTagColor(booking.serviceType)}
                                            className="!rounded-full !px-3 !py-1 text-sm"
                                        >
                                            <span className="mr-1">
                                                {serviceMeta(booking.serviceType).emoji}
                                            </span>
                                            {serviceMeta(booking.serviceType).label}
                                        </Tag>
                                    }
                                />
                                <div className="space-y-4">
                                    {booking.serviceTitle ? (
                                        <div>
                                            <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                                Subject
                                            </div>
                                            <Title level={4} style={{ margin: 0 }}>
                                                {booking.serviceTitle}
                                            </Title>
                                        </div>
                                    ) : null}

                                    {detailEntries.length > 0 ? (
                                        <div>
                                            <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                                Details captured
                                            </div>
                                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                {detailEntries.map(([k, v]) => (
                                                    <div
                                                        key={k}
                                                        className="rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2"
                                                    >
                                                        <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                                            {humanizeDetailKey(k)}
                                                        </div>
                                                        <div className="mt-0.5 break-words text-sm font-medium text-slate-800">
                                                            {detailValuePreview(v)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : null}

                                    {!booking.serviceTitle && detailEntries.length === 0 ? (
                                        <Text type="secondary" className="block text-sm">
                                            No additional service context captured.
                                        </Text>
                                    ) : null}
                                </div>
                            </Card>
                        );
                    })()}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card
                        variant="borderless"
                        className="rounded-2xl shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                        styles={{ body: { padding: 24 } }}
                    >
                        <SectionTitle
                            icon={<FileSearchOutlined />}
                            title="Pipeline"
                            description="Move this booking through your sales workflow."
                        />
                        <div className="space-y-5">
                            <div>
                                <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                    Status
                                </div>
                                <Select
                                    value={booking.status}
                                    onChange={(v) => void handleStatus(v as BookingStatus)}
                                    loading={savingStatus}
                                    style={{ width: "100%" }}
                                    size="large"
                                    options={BOOKING_STATUS_OPTIONS.map((s) => ({
                                        value: s,
                                        label: (
                                            <Space>
                                                {s === "Confirmed" ? (
                                                    <CheckCircleTwoTone twoToneColor="#16a34a" />
                                                ) : s === "Cancelled" ? (
                                                    <PauseCircleTwoTone twoToneColor="#dc2626" />
                                                ) : s === "Contacted" ? (
                                                    <FileSearchOutlined
                                                        style={{ color: "#2563eb" }}
                                                    />
                                                ) : (
                                                    <ClockCircleOutlined />
                                                )}
                                                <span>{s}</span>
                                            </Space>
                                        ),
                                    }))}
                                />
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                    {BOOKING_STATUS_OPTIONS.filter((s) => s !== booking.status)
                                        .slice(0, 2)
                                        .map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                disabled={savingStatus}
                                                onClick={() => void handleStatus(s)}
                                                className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition ${statusBg(
                                                    s
                                                )} hover:opacity-90 disabled:opacity-60`}
                                            >
                                                Mark as {s}
                                            </button>
                                        ))}
                                </div>
                            </div>

                            <div>
                                <div className="mb-1.5 flex items-center justify-between">
                                    <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                        Internal notes
                                    </span>
                                    <Text type="secondary" className="text-[11px]">
                                        Admins only
                                    </Text>
                                </div>
                                <Input.TextArea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    autoSize={{ minRows: 4, maxRows: 10 }}
                                    placeholder="Anything the team should know about this booking…"
                                    maxLength={4000}
                                    showCount
                                    style={{ borderRadius: 12, marginBottom: 15 }}
                                />
                                <div className="mt-2 flex justify-end">
                                    <Button
                                        type="primary"
                                        size="small"
                                        icon={<SaveOutlined />}
                                        loading={savingNotes}
                                        onClick={() => void handleSaveNotes()}
                                    >
                                        Save notes
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card
                        variant="borderless"
                        className="rounded-2xl shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                        styles={{ body: { padding: 24 } }}
                    >
                        <SectionTitle
                            icon={
                                risk.score === "high" ? (
                                    <WarningTwoTone twoToneColor="#dc2626" />
                                ) : risk.score === "medium" ? (
                                    <ExclamationCircleTwoTone twoToneColor="#f59e0b" />
                                ) : (
                                    <SafetyCertificateTwoTone twoToneColor="#16a34a" />
                                )
                            }
                            title="Risk & spam signals"
                            description={`Counts within the last ${risk.windowDays} days.`}
                            extra={<RiskBadge score={risk.score} />}
                        />

                        <div className="grid grid-cols-3 gap-3">
                            <div
                                className={`rounded-2xl border p-3 text-center ${
                                    risk.ipCount >= 4
                                        ? "border-amber-200 bg-amber-50/60"
                                        : "border-slate-100 bg-slate-50/70"
                                }`}
                            >
                                <div className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                    Same IP
                                </div>
                                <div className="mt-1 text-lg font-semibold text-slate-800">
                                    {risk.ipCount}
                                </div>
                            </div>
                            <div
                                className={`rounded-2xl border p-3 text-center ${
                                    risk.emailCount >= 4
                                        ? "border-amber-200 bg-amber-50/60"
                                        : "border-slate-100 bg-slate-50/70"
                                }`}
                            >
                                <div className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                    Same email
                                </div>
                                <div className="mt-1 text-lg font-semibold text-slate-800">
                                    {risk.emailCount}
                                </div>
                            </div>
                            <div
                                className={`rounded-2xl border p-3 text-center ${
                                    risk.phoneCount >= 4
                                        ? "border-amber-200 bg-amber-50/60"
                                        : "border-slate-100 bg-slate-50/70"
                                }`}
                            >
                                <div className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                    Same phone
                                </div>
                                <div className="mt-1 text-lg font-semibold text-slate-800">
                                    {risk.phoneCount}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 divide-y divide-slate-100">
                            <MetaRow label="IP address">
                                {booking.ipAddress ? (
                                    <Tooltip title="Click to copy">
                                        <button
                                            type="button"
                                            className="font-mono text-xs text-slate-700 hover:text-slate-900 hover:underline"
                                            onClick={() =>
                                                copyValue(booking.ipAddress, "IP address", message)
                                            }
                                        >
                                            {booking.ipAddress}
                                        </button>
                                    </Tooltip>
                                ) : (
                                    <Text type="secondary">—</Text>
                                )}
                            </MetaRow>
                            <MetaRow label="User agent">
                                {booking.userAgent ? (
                                    <Tooltip title={booking.userAgent}>
                                        <span
                                            className="block max-w-[220px] truncate text-xs text-slate-500"
                                            style={{ maxWidth: 220 }}
                                        >
                                            {booking.userAgent}
                                        </span>
                                    </Tooltip>
                                ) : (
                                    <Text type="secondary">—</Text>
                                )}
                            </MetaRow>
                        </div>

                        {risk.score !== "low" ? (
                            <Alert
                                className="!mt-4 !rounded-2xl"
                                type={risk.score === "high" ? "error" : "warning"}
                                showIcon
                                icon={<StopOutlined />}
                                title={
                                    risk.score === "high"
                                        ? "Multiple submissions detected — verify before confirming."
                                        : "Repeated submissions from this contact — double-check before confirming."
                                }
                            />
                        ) : null}
                    </Card>

                    <Card
                        variant="borderless"
                        className="rounded-2xl shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                        styles={{ body: { padding: 24 } }}
                    >
                        <SectionTitle
                            icon={<TeamOutlined />}
                            title="Related submissions"
                            description="Other bookings or leads matching this customer."
                        />
                        {totalRelated === 0 && related.leads.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-8 text-center">
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={
                                        <span className="text-slate-500">
                                            No other submissions from this customer
                                        </span>
                                    }
                                />
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {related.sameEmail.length ? (
                                    <div>
                                        <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                            Same email · {related.sameEmail.length}
                                        </div>
                                        <ul className="space-y-1">
                                            {related.sameEmail.map((b) => (
                                                <li
                                                    key={`e-${b.id}`}
                                                    className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2 text-sm transition hover:border-slate-200"
                                                >
                                                    <Link
                                                        href={`/portal/admin/dashboard/leads/bookings/${b.id}`}
                                                        className="min-w-0 flex-1 truncate text-slate-700 hover:text-primary hover:underline"
                                                    >
                                                        #{b.id} · {b.serviceTitle || b.tourTitle || "General"}
                                                    </Link>
                                                    <span className="text-xs text-slate-400">
                                                        {relativeTime(b.createdAt)}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : null}
                                {related.samePhone.length ? (
                                    <div>
                                        <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                            Same phone · {related.samePhone.length}
                                        </div>
                                        <ul className="space-y-1">
                                            {related.samePhone.map((b) => (
                                                <li
                                                    key={`p-${b.id}`}
                                                    className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2 text-sm transition hover:border-slate-200"
                                                >
                                                    <Link
                                                        href={`/portal/admin/dashboard/leads/bookings/${b.id}`}
                                                        className="min-w-0 flex-1 truncate text-slate-700 hover:text-primary hover:underline"
                                                    >
                                                        #{b.id} · {b.serviceTitle || b.tourTitle || "General"}
                                                    </Link>
                                                    <span className="text-xs text-slate-400">
                                                        {relativeTime(b.createdAt)}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : null}
                                {related.sameIp.length ? (
                                    <div>
                                        <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                            Same IP · {related.sameIp.length}
                                        </div>
                                        <ul className="space-y-1">
                                            {related.sameIp.map((b) => (
                                                <li
                                                    key={`ip-${b.id}`}
                                                    className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2 text-sm transition hover:border-slate-200"
                                                >
                                                    <Link
                                                        href={`/portal/admin/dashboard/leads/bookings/${b.id}`}
                                                        className="min-w-0 flex-1 truncate text-slate-700 hover:text-primary hover:underline"
                                                    >
                                                        #{b.id} · {b.name}
                                                    </Link>
                                                    <span className="text-xs text-slate-400">
                                                        {relativeTime(b.createdAt)}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : null}
                                {related.leads.length ? (
                                    <div>
                                        <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                            Website leads · {related.leads.length}
                                        </div>
                                        <ul className="space-y-1">
                                            {related.leads.map((l) => (
                                                <li
                                                    key={`l-${l.id}`}
                                                    className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2 text-sm transition hover:border-slate-200"
                                                >
                                                    <span className="min-w-0 flex-1 truncate">
                                                        <Tag color="blue" className="!rounded-full">
                                                            {l.source}
                                                        </Tag>
                                                        {l.pageUrl ? (
                                                            <span className="text-xs text-slate-400">
                                                                {l.pageUrl}
                                                            </span>
                                                        ) : null}
                                                    </span>
                                                    <span className="text-xs text-slate-400">
                                                        {relativeTime(l.createdAt)}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </Card>

                    <Card
                        variant="borderless"
                        className="rounded-2xl shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                        styles={{ body: { padding: 24 } }}
                    >
                        <SectionTitle
                            icon={<GlobalOutlined />}
                            title="Submission metadata"
                        />
                        <div className="divide-y divide-slate-100">
                            <MetaRow label="Booking date">
                                {booking.bookingDate ? (
                                    <span className="font-medium text-slate-700">
                                        {fmtDate(booking.bookingDate)}
                                    </span>
                                ) : (
                                    <Text type="secondary">Not set</Text>
                                )}
                            </MetaRow>
                            <MetaRow label="Source">{booking.source || "—"}</MetaRow>
                            <MetaRow label="Created">{fmtDate(booking.createdAt, true)}</MetaRow>
                            <MetaRow label="Updated">{fmtDate(booking.updatedAt, true)}</MetaRow>
                            {tourId ? <MetaRow label="Tour ID">#{tourId}</MetaRow> : null}
                        </div>
                    </Card>
                </div>
            </div>

            <BookingFormModal
                open={editOpen}
                initial={booking as unknown as BookingRecord}
                onClose={() => setEditOpen(false)}
                onSaved={() => {
                    setEditOpen(false);
                    void refresh();
                }}
            />
        </div>
    );
}
