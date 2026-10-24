"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    Alert,
    App,
    Button,
    Card,
    Col,
    Empty,
    Input,
    Popconfirm,
    Row,
    Select,
    Space,
    Statistic,
    Table,
    Tabs,
    Tag,
    Tooltip,
    Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
    BarChartOutlined,
    CalendarOutlined,
    CheckCircleTwoTone,
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    FileSearchOutlined,
    PauseCircleTwoTone,
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined,
    StopOutlined,
} from "@ant-design/icons";
import BookingFormModal from "./components/BookingFormModal";
import LeadDetailModal from "./components/LeadDetailModal";
import {
    BOOKING_SERVICE_OPTIONS,
    BOOKING_STATUS_OPTIONS,
    BookingRecord,
    BookingServiceType,
    BookingStatus,
    LEAD_STATUS_OPTIONS,
    LeadRecord,
    LeadStatus,
    inquiryMeta,
    leadEmail,
} from "./types";

function bookingTourLabel(record: BookingRecord): string | null {
    return record.Tour?.title || record.tourTitle || null;
}

function bookingTourId(record: BookingRecord): number | null {
    return record.Tour?.id ?? record.tourId ?? null;
}

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
            return "volcano";
        case "visa":
            return "orange";
        case "resort":
            return "gold";
        default:
            return "default";
    }
}

function bookingServiceLabel(record: BookingRecord): string | null {
    return record.serviceTitle || bookingTourLabel(record);
}

const { Title, Text } = Typography;

function fmtDate(value: string | null | undefined, withTime = false) {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return withTime ? d.toLocaleString() : d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function bookingStatusColor(status: BookingStatus): string {
    switch (status) {
        case "Confirmed":
            return "success";
        case "Contacted":
            return "processing";
        case "Cancelled":
            return "error";
        default:
            return "default";
    }
}

function leadStatusColor(status: LeadStatus): string {
    switch (status) {
        case "Converted":
            return "success";
        case "Contacted":
            return "processing";
        case "Spam":
            return "error";
        case "Closed":
            return "default";
        default:
            return "blue";
    }
}

function sourceTagColor(source: string | null | undefined) {
    if ((source || "").toLowerCase().includes("sunvia")) return "gold";
    return "volcano";
}

function useBookings() {
    const [items, setItems] = useState<BookingRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/bookings", { cache: "no-store" });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.error || "Failed to load bookings");
            setItems(Array.isArray(json?.data) ? json.data : []);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load bookings");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    return { items, setItems, loading, error, refresh };
}

function useLeads() {
    const [items, setItems] = useState<LeadRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/leads", { cache: "no-store" });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.error || "Failed to load leads");
            setItems(Array.isArray(json?.data) ? json.data : []);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load leads");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    return { items, setItems, loading, error, refresh };
}

function BookingsPanel() {
    const { message } = App.useApp();
    const { items, setItems, loading, error, refresh } = useBookings();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
    const [serviceFilter, setServiceFilter] = useState<BookingServiceType | "all">("all");
    const [tourFilter, setTourFilter] = useState<number | "all" | "none">("all");
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<BookingRecord | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const tourOptions = useMemo(() => {
        const map = new Map<number, string>();
        for (const b of items) {
            const tid = bookingTourId(b);
            const label = bookingTourLabel(b);
            if (tid && label && !map.has(tid)) map.set(tid, label);
        }
        return Array.from(map.entries())
            .map(([id, label]) => ({ id, label }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [items]);

    const stats = useMemo(() => {
        const stats = { total: items.length, contacted: 0, confirmed: 0, cancelled: 0 };
        for (const b of items) {
            if (b.status === "Contacted") stats.contacted += 1;
            else if (b.status === "Confirmed") stats.confirmed += 1;
            else if (b.status === "Cancelled") stats.cancelled += 1;
        }
        return stats;
    }, [items]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return items.filter((b) => {
            if (statusFilter !== "all" && b.status !== statusFilter) return false;
            if (serviceFilter !== "all" && b.serviceType !== serviceFilter) return false;
            const tid = bookingTourId(b);
            if (tourFilter === "none" && tid) return false;
            if (typeof tourFilter === "number" && tid !== tourFilter) return false;
            if (!q) return true;
            return [
                b.name,
                b.email,
                b.phone,
                b.message,
                b.source,
                b.ipAddress,
                b.serviceTitle,
                bookingTourLabel(b),
                b.tourSlug,
            ]
                .filter(Boolean)
                .some((v) => String(v).toLowerCase().includes(q));
        });
    }, [items, search, statusFilter, serviceFilter, tourFilter]);

    const handleDelete = async (id: number) => {
        setDeletingId(id);
        try {
            const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Failed to delete booking");
            setItems((prev) => prev.filter((b) => b.id !== id));
            message.success("Booking deleted");
        } catch (e) {
            if (e instanceof Error) message.error(e.message);
        } finally {
            setDeletingId(null);
        }
    };

    const handleSaved = (record: BookingRecord) => {
        setItems((prev) => {
            const idx = prev.findIndex((b) => b.id === record.id);
            if (idx === -1) return [record, ...prev];
            const next = [...prev];
            next[idx] = record;
            return next;
        });
    };

    const columns: ColumnsType<BookingRecord> = [
        {
            title: "Customer",
            dataIndex: "name",
            key: "name",
            render: (_text, record) => (
                <div>
                    <Link
                        href={`/portal/admin/dashboard/leads/bookings/${record.id}`}
                        className="font-medium text-[#2a2118] hover:text-primary hover:underline"
                    >
                        {record.name}
                    </Link>
                    <div className="text-xs text-[#6b5c4d]">
                        {record.email ? (
                            <a href={`mailto:${record.email}`} className="hover:underline">
                                {record.email}
                            </a>
                        ) : (
                            <a href={`tel:${record.phone}`} className="hover:underline">
                                {record.phone}
                            </a>
                        )}
                    </div>
                </div>
            ),
        },
        {
            title: "Service",
            key: "service",
            render: (_, record) => {
                const meta = serviceMeta(record.serviceType);
                const label = bookingServiceLabel(record);
                const tid = bookingTourId(record);
                return (
                    <div className="space-y-1">
                        <Tag color={serviceTagColor(record.serviceType)} className="font-semibold">
                            <span className="mr-1">{meta.emoji}</span>
                            {meta.label}
                        </Tag>
                        {label ? (
                            tid ? (
                                <Link
                                    href={`/portal/admin/dashboard/tours/${tid}`}
                                    className="block max-w-[240px] truncate text-xs font-medium text-[#3f342b] hover:text-primary"
                                >
                                    {label}
                                </Link>
                            ) : (
                                <div
                                    className="max-w-[240px] truncate text-xs text-[#6b5c4d]"
                                    title={label}
                                >
                                    {label}
                                </div>
                            )
                        ) : (
                            <div className="text-[11px] text-[#8a7a6a]">General inquiry</div>
                        )}
                        {record.tourSlug ? (
                            <a
                                href={`/tours/${record.tourSlug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-[11px] text-[#8a7a6a] hover:text-primary"
                            >
                                /tours/{record.tourSlug}
                            </a>
                        ) : null}
                    </div>
                );
            },
            filters: BOOKING_SERVICE_OPTIONS.map((s) => ({
                text: `${s.emoji} ${s.label}`,
                value: s.value,
            })),
            onFilter: (value, record) => record.serviceType === value,
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
            render: (phone: string) => (
                <a href={`tel:${phone}`} className="hover:underline">
                    {phone}
                </a>
            ),
            responsive: ["md"],
        },
        {
            title: "Booking date",
            dataIndex: "bookingDate",
            key: "bookingDate",
            render: (d: string | null) => fmtDate(d),
            responsive: ["md"],
        },
        {
            title: "Message",
            dataIndex: "message",
            key: "message",
            render: (m: string) =>
                m ? (
                    <Tooltip title={<span className="whitespace-pre-line">{m}</span>}>
                        <span className="line-clamp-1 max-w-[260px] text-[#3f342b]">{m}</span>
                    </Tooltip>
                ) : (
                    <span className="text-[#8a7a6a]">—</span>
                ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: BookingStatus) => (
                <Tag color={bookingStatusColor(status)}>{status.toUpperCase()}</Tag>
            ),
            filters: BOOKING_STATUS_OPTIONS.map((s) => ({ text: s, value: s })),
            onFilter: (value, record) => record.status === value,
        },
        {
            title: "IP",
            dataIndex: "ipAddress",
            key: "ipAddress",
            render: (ip: string | null) =>
                ip ? <span className="font-mono text-xs">{ip}</span> : <span className="text-[#8a7a6a]">—</span>,
            responsive: ["lg"],
        },
        {
            title: "Created",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (d: string) => fmtDate(d, true),
            responsive: ["lg"],
        },
        {
            title: "",
            key: "actions",
            width: 150,
            render: (_, record) => (
                <Space size={4}>
                    <Tooltip title="Open CRM detail">
                        <Link href={`/portal/admin/dashboard/leads/bookings/${record.id}`}>
                            <Button type="text" size="small" icon={<EyeOutlined />} />
                        </Link>
                    </Tooltip>
                    <Tooltip title="Quick edit">
                        <Button
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setEditing(record);
                                setModalOpen(true);
                            }}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Delete this booking?"
                        description="This action cannot be undone."
                        okText="Delete"
                        okButtonProps={{ danger: true, loading: deletingId === record.id }}
                        cancelText="Cancel"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button type="text" size="small" danger icon={<DeleteOutlined />} loading={deletingId === record.id} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <Row gutter={[12, 12]}>
                <Col xs={12} lg={6}>
                    <Card variant="borderless" className="rounded-2xl border border-[#eadfce] shadow-sm">
                        <Statistic
                            title="Total inquiries"
                            value={stats.total}
                            prefix={<BarChartOutlined />}
                            loading={loading}
                        />
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card variant="borderless" className="rounded-2xl border border-[#eadfce] shadow-sm">
                        <Statistic
                            title="Contacted"
                            value={stats.contacted}
                            prefix={<FileSearchOutlined />}
                            styles={{ content: { color: "#9a3412" } }}
                            loading={loading}
                        />
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card variant="borderless" className="rounded-2xl border border-[#eadfce] shadow-sm">
                        <Statistic
                            title="Confirmed"
                            value={stats.confirmed}
                            prefix={<CheckCircleTwoTone twoToneColor="#15803d" />}
                            styles={{ content: { color: "#15803d" } }}
                            loading={loading}
                        />
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card variant="borderless" className="rounded-2xl border border-[#eadfce] shadow-sm">
                        <Statistic
                            title="Cancelled"
                            value={stats.cancelled}
                            prefix={<PauseCircleTwoTone twoToneColor="#dc2626" />}
                            styles={{ content: { color: "#dc2626" } }}
                            loading={loading}
                        />
                    </Card>
                </Col>
            </Row>

            {error ? <Alert type="error" showIcon title={error} /> : null}

            <Card variant="borderless" className="rounded-2xl border border-[#eadfce] shadow-sm">
                <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                    <div className="grid w-full flex-1 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <Input
                            allowClear
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name, email, phone, tour, IP…"
                            prefix={<SearchOutlined className="text-[#8a7a6a]" />}
                            style={{ width: "100%" }}
                        />
                        <Select
                            value={statusFilter}
                            onChange={(v) => setStatusFilter(v)}
                            options={[
                                { value: "all", label: "All statuses" },
                                ...BOOKING_STATUS_OPTIONS.map((s) => ({ value: s, label: s })),
                            ]}
                            style={{ width: "100%" }}
                        />
                        <Select
                            value={serviceFilter}
                            onChange={(v) => setServiceFilter(v)}
                            options={[
                                { value: "all", label: "All services" },
                                ...BOOKING_SERVICE_OPTIONS.map((s) => ({
                                    value: s.value,
                                    label: `${s.emoji} ${s.label}`,
                                })),
                            ]}
                            style={{ width: "100%" }}
                        />
                        <Select
                            value={tourFilter}
                            onChange={(v) => setTourFilter(v)}
                            options={[
                                { value: "all", label: "All tours" },
                                { value: "none", label: "No tour (general)" },
                                ...tourOptions.map((t) => ({ value: t.id, label: t.label })),
                            ]}
                            disabled={tourOptions.length === 0}
                            showSearch
                            optionFilterProp="label"
                            style={{ width: "100%" }}
                        />
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                        <Button icon={<ReloadOutlined />} onClick={() => void refresh()} loading={loading}>
                            Refresh
                        </Button>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                setEditing(null);
                                setModalOpen(true);
                            }}
                        >
                            New inquiry
                        </Button>
                    </div>
                </div>

                <Table<BookingRecord>
                    rowKey="id"
                    size="middle"
                    loading={loading}
                    columns={columns}
                    dataSource={filtered}
                    scroll={{ x: 980 }}
                    pagination={{ pageSize: 10, showSizeChanger: true }}
                    locale={{
                        emptyText: <Empty description={loading ? "Loading…" : "No inquiries yet"} />,
                    }}
                />
            </Card>

            <BookingFormModal
                open={modalOpen}
                initial={editing}
                onClose={() => setModalOpen(false)}
                onSaved={handleSaved}
            />
        </div>
    );
}

function LeadsPanel() {
    const { message } = App.useApp();
    const { items, setItems, loading, error, refresh } = useLeads();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
    const [sourceFilter, setSourceFilter] = useState<string | "all">("all");
    const [viewing, setViewing] = useState<LeadRecord | null>(null);
    const [busyId, setBusyId] = useState<number | null>(null);

    const sources = useMemo(() => {
        const set = new Set<string>();
        for (const l of items) {
            if (l.source) set.add(l.source);
        }
        return Array.from(set).sort();
    }, [items]);

    const stats = useMemo(() => {
        const stats = { total: items.length, contacted: 0, converted: 0, spam: 0 };
        for (const l of items) {
            if (l.status === "Contacted") stats.contacted += 1;
            else if (l.status === "Converted") stats.converted += 1;
            else if (l.status === "Spam") stats.spam += 1;
        }
        return stats;
    }, [items]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return items.filter((l) => {
            if (statusFilter !== "all" && l.status !== statusFilter) return false;
            if (sourceFilter !== "all" && l.source !== sourceFilter) return false;
            if (!q) return true;
            return [l.name, l.email, l.phone, l.message, l.source, l.pageUrl, l.ipAddress]
                .filter(Boolean)
                .some((v) => String(v).toLowerCase().includes(q));
        });
    }, [items, search, statusFilter, sourceFilter]);

    const handleDelete = async (id: number) => {
        setBusyId(id);
        try {
            const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Failed to delete lead");
            setItems((prev) => prev.filter((l) => l.id !== id));
            message.success("Lead deleted");
        } catch (e) {
            if (e instanceof Error) message.error(e.message);
        } finally {
            setBusyId(null);
        }
    };

    const handleMarkSpam = async (id: number) => {
        setBusyId(id);
        try {
            const res = await fetch(`/api/leads/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "Spam" }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Failed to update lead");
            setItems((prev) => prev.map((l) => (l.id === id ? (data as LeadRecord) : l)));
            message.success("Marked as spam");
        } catch (e) {
            if (e instanceof Error) message.error(e.message);
        } finally {
            setBusyId(null);
        }
    };

    const handleSaved = (record: LeadRecord) => {
        setItems((prev) => prev.map((l) => (l.id === record.id ? record : l)));
    };

    const columns: ColumnsType<LeadRecord> = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (_text, record) => {
                const email = leadEmail(record.email);
                const meta = inquiryMeta(record.message);
                return (
                    <div>
                        <div className="font-medium text-[#2a2118]">{record.name}</div>
                        {email ? (
                            <div className="text-xs text-[#6b5c4d]">
                                <a href={`mailto:${email}`} className="hover:underline">
                                    {email}
                                </a>
                            </div>
                        ) : (
                            <div className="text-xs text-[#6b5c4d]">Phone inquiry</div>
                        )}
                        {meta.preferred || meta.interest ? (
                            <div className="mt-1 flex flex-wrap gap-1">
                                {meta.preferred ? <Tag>{meta.preferred}</Tag> : null}
                                {meta.interest ? <Tag color="gold">{meta.interest}</Tag> : null}
                            </div>
                        ) : null}
                    </div>
                );
            },
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
            render: (phone: string) => (
                <a href={`tel:${phone}`} className="hover:underline">
                    {phone}
                </a>
            ),
            responsive: ["md"],
        },
        {
            title: "Source",
            dataIndex: "source",
            key: "source",
            render: (source: string, record) => (
                <div className="space-y-1">
                    <Tag color={sourceTagColor(source)}>{source}</Tag>
                    {record.pageUrl ? (
                        <div className="max-w-[220px] truncate text-[11px] text-[#8a7a6a]">
                            {record.pageUrl}
                        </div>
                    ) : null}
                </div>
            ),
        },
        {
            title: "Message",
            dataIndex: "message",
            key: "message",
            render: (m: string) =>
                m ? (
                    <Tooltip title={<span className="whitespace-pre-line">{m}</span>}>
                        <span className="line-clamp-1 max-w-[240px] text-[#3f342b]">{m}</span>
                    </Tooltip>
                ) : (
                    <span className="text-[#8a7a6a]">—</span>
                ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: LeadStatus) => <Tag color={leadStatusColor(status)}>{status.toUpperCase()}</Tag>,
            filters: LEAD_STATUS_OPTIONS.map((s) => ({ text: s, value: s })),
            onFilter: (value, record) => record.status === value,
        },
        {
            title: "IP",
            dataIndex: "ipAddress",
            key: "ipAddress",
            render: (ip: string | null) =>
                ip ? <span className="font-mono text-xs">{ip}</span> : <span className="text-[#8a7a6a]">—</span>,
            responsive: ["lg"],
        },
        {
            title: "Captured",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (d: string) => fmtDate(d, true),
            responsive: ["lg"],
        },
        {
            title: "",
            key: "actions",
            width: 140,
            render: (_, record) => (
                <Space size={4}>
                    <Tooltip title="View">
                        <Button
                            type="text"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => setViewing(record)}
                        />
                    </Tooltip>
                    {record.status !== "Spam" ? (
                        <Tooltip title="Mark as spam">
                            <Popconfirm
                                title="Mark this lead as spam?"
                                onConfirm={() => handleMarkSpam(record.id)}
                                okText="Yes"
                                okButtonProps={{ loading: busyId === record.id }}
                                cancelText="No"
                            >
                                <Button type="text" size="small" icon={<StopOutlined />} loading={busyId === record.id} />
                            </Popconfirm>
                        </Tooltip>
                    ) : null}
                    <Popconfirm
                        title="Delete this lead?"
                        description="This action cannot be undone."
                        okText="Delete"
                        okButtonProps={{ danger: true, loading: busyId === record.id }}
                        cancelText="Cancel"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button type="text" size="small" danger icon={<DeleteOutlined />} loading={busyId === record.id} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <Row gutter={[12, 12]}>
                <Col xs={12} lg={6}>
                    <Card variant="borderless" className="rounded-2xl border border-[#eadfce] shadow-sm">
                        <Statistic
                            title="Total messages"
                            value={stats.total}
                            prefix={<BarChartOutlined />}
                            loading={loading}
                        />
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card variant="borderless" className="rounded-2xl border border-[#eadfce] shadow-sm">
                        <Statistic
                            title="Contacted"
                            value={stats.contacted}
                            prefix={<FileSearchOutlined />}
                            styles={{ content: { color: "#9a3412" } }}
                            loading={loading}
                        />
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card variant="borderless" className="rounded-2xl border border-[#eadfce] shadow-sm">
                        <Statistic
                            title="Converted"
                            value={stats.converted}
                            prefix={<CheckCircleTwoTone twoToneColor="#15803d" />}
                            styles={{ content: { color: "#15803d" } }}
                            loading={loading}
                        />
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card variant="borderless" className="rounded-2xl border border-[#eadfce] shadow-sm">
                        <Statistic
                            title="Spam"
                            value={stats.spam}
                            prefix={<StopOutlined />}
                            styles={{ content: { color: "#dc2626" } }}
                            loading={loading}
                        />
                    </Card>
                </Col>
            </Row>

            {error ? <Alert type="error" showIcon title={error} /> : null}

            <Card variant="borderless" className="rounded-2xl border border-[#eadfce] shadow-sm">
                <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                    <div className="grid w-full flex-1 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        <Input
                            allowClear
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name, email, source, IP…"
                            prefix={<SearchOutlined className="text-[#8a7a6a]" />}
                            style={{ width: "100%" }}
                        />
                        <Select
                            value={statusFilter}
                            onChange={(v) => setStatusFilter(v)}
                            options={[
                                { value: "all", label: "All statuses" },
                                ...LEAD_STATUS_OPTIONS.map((s) => ({ value: s, label: s })),
                            ]}
                            style={{ width: "100%" }}
                        />
                        <Select
                            value={sourceFilter}
                            onChange={(v) => setSourceFilter(v)}
                            options={[
                                { value: "all", label: "All sources" },
                                ...sources.map((s) => ({ value: s, label: s })),
                            ]}
                            placeholder="Filter by source"
                            showSearch
                            optionFilterProp="label"
                            disabled={sources.length === 0}
                            style={{ width: "100%" }}
                        />
                    </div>
                    <Button icon={<ReloadOutlined />} onClick={() => void refresh()} loading={loading}>
                        Refresh
                    </Button>
                </div>

                <Table<LeadRecord>
                    rowKey="id"
                    size="middle"
                    loading={loading}
                    columns={columns}
                    dataSource={filtered}
                    scroll={{ x: 860 }}
                    pagination={{ pageSize: 10, showSizeChanger: true }}
                    locale={{
                        emptyText: <Empty description={loading ? "Loading…" : "No contact messages yet"} />,
                    }}
                />
            </Card>

            <LeadDetailModal
                open={Boolean(viewing)}
                lead={viewing}
                onClose={() => setViewing(null)}
                onSaved={handleSaved}
            />
        </div>
    );
}

export default function LeadsPage() {
    return (
        <div className="space-y-4">
            <div>
                <Title level={2} style={{ margin: 0 }}>
                    Lead Management
                </Title>
                <Text type="secondary">
                    Inquiries holds visa, ticket, tour, and resort requests. Contact messages holds
                    website forms that are not a service request.
                </Text>
            </div>

            <Tabs
                defaultActiveKey="inquiries"
                items={[
                    {
                        key: "inquiries",
                        label: (
                            <span>
                                <CalendarOutlined className="mr-2" />
                                Inquiries
                            </span>
                        ),
                        children: <BookingsPanel />,
                    },
                    {
                        key: "messages",
                        label: (
                            <span>
                                <BarChartOutlined className="mr-2" />
                                Contact messages
                            </span>
                        ),
                        children: <LeadsPanel />,
                    },
                ]}
            />
        </div>
    );
}
