"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    Alert,
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
    message,
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
            return "geekblue";
        case "visa":
            return "purple";
        case "resort":
            return "magenta";
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
    const { items, setItems, loading, error, refresh } = useBookings();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
    const [serviceFilter, setServiceFilter] = useState<BookingServiceType | "all">("all");
    const [tourFilter, setTourFilter] = useState<number | "all" | "none">("all");
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<BookingRecord | null>(null);

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
        try {
            const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Failed to delete booking");
            setItems((prev) => prev.filter((b) => b.id !== id));
            message.success("Booking deleted");
        } catch (e) {
            if (e instanceof Error) message.error(e.message);
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
                        className="font-medium text-gray-800 hover:text-primary hover:underline"
                    >
                        {record.name}
                    </Link>
                    <div className="text-xs text-gray-500">
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
                                    className="block max-w-[240px] truncate text-xs font-medium text-gray-700 hover:text-primary"
                                >
                                    {label}
                                </Link>
                            ) : (
                                <div
                                    className="max-w-[240px] truncate text-xs text-gray-600"
                                    title={label}
                                >
                                    {label}
                                </div>
                            )
                        ) : (
                            <div className="text-[11px] text-gray-400">General inquiry</div>
                        )}
                        {record.tourSlug ? (
                            <a
                                href={`/tours/${record.tourSlug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-[11px] text-gray-400 hover:text-primary"
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
                        <span className="line-clamp-1 max-w-[260px] text-gray-700">{m}</span>
                    </Tooltip>
                ) : (
                    <span className="text-gray-400">—</span>
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
                ip ? <span className="font-mono text-xs">{ip}</span> : <span className="text-gray-400">—</span>,
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
                        okButtonProps={{ danger: true }}
                        cancelText="Cancel"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <Row gutter={[16, 16]}>
                <Col xs={12} md={6}>
                    <Card variant="borderless" className="shadow-sm">
                        <Statistic
                            title="Total bookings"
                            value={stats.total}
                            prefix={<BarChartOutlined />}
                            loading={loading}
                        />
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card variant="borderless" className="shadow-sm">
                        <Statistic
                            title="Contacted"
                            value={stats.contacted}
                            prefix={<FileSearchOutlined />}
                            styles={{ content: { color: "#2563eb" } }}
                            loading={loading}
                        />
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card variant="borderless" className="shadow-sm">
                        <Statistic
                            title="Confirmed"
                            value={stats.confirmed}
                            prefix={<CheckCircleTwoTone twoToneColor="#16a34a" />}
                            styles={{ content: { color: "#16a34a" } }}
                            loading={loading}
                        />
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card variant="borderless" className="shadow-sm">
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

            <Card variant="borderless" className="shadow-sm">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <Space wrap>
                        <Input
                            allowClear
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name, email, phone, tour, IP…"
                            prefix={<SearchOutlined className="text-gray-400" />}
                            style={{ width: 300 }}
                        />
                        <Select
                            value={statusFilter}
                            onChange={(v) => setStatusFilter(v)}
                            options={[
                                { value: "all", label: "All statuses" },
                                ...BOOKING_STATUS_OPTIONS.map((s) => ({ value: s, label: s })),
                            ]}
                            style={{ width: 160 }}
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
                            style={{ width: 180 }}
                        />
                        <Select
                            value={tourFilter}
                            onChange={(v) => setTourFilter(v)}
                            options={[
                                { value: "all", label: "All tours" },
                                { value: "none", label: "No tour (general)" },
                                ...tourOptions.map((t) => ({ value: t.id, label: t.label })),
                            ]}
                            style={{ width: 220 }}
                            disabled={tourOptions.length === 0}
                            showSearch
                            optionFilterProp="label"
                        />
                    </Space>
                    <Space>
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
                            New booking
                        </Button>
                    </Space>
                </div>

                <Table<BookingRecord>
                    rowKey="id"
                    size="middle"
                    loading={loading}
                    columns={columns}
                    dataSource={filtered}
                    pagination={{ pageSize: 10, showSizeChanger: true }}
                    locale={{
                        emptyText: <Empty description={loading ? "Loading…" : "No bookings yet"} />,
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
    const { items, setItems, loading, error, refresh } = useLeads();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
    const [sourceFilter, setSourceFilter] = useState<string | "all">("all");
    const [viewing, setViewing] = useState<LeadRecord | null>(null);

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
        try {
            const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Failed to delete lead");
            setItems((prev) => prev.filter((l) => l.id !== id));
            message.success("Lead deleted");
        } catch (e) {
            if (e instanceof Error) message.error(e.message);
        }
    };

    const handleMarkSpam = async (id: number) => {
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
            render: (_text, record) => (
                <div>
                    <div className="font-medium text-gray-800">{record.name}</div>
                    <div className="text-xs text-gray-500">
                        <a href={`mailto:${record.email}`} className="hover:underline">
                            {record.email}
                        </a>
                    </div>
                </div>
            ),
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
                    <Tag color="blue">{source}</Tag>
                    {record.pageUrl ? (
                        <div className="max-w-[220px] truncate text-[11px] text-gray-400">
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
                        <span className="line-clamp-1 max-w-[240px] text-gray-700">{m}</span>
                    </Tooltip>
                ) : (
                    <span className="text-gray-400">—</span>
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
                ip ? <span className="font-mono text-xs">{ip}</span> : <span className="text-gray-400">—</span>,
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
                                cancelText="No"
                            >
                                <Button type="text" size="small" icon={<StopOutlined />} />
                            </Popconfirm>
                        </Tooltip>
                    ) : null}
                    <Popconfirm
                        title="Delete this lead?"
                        description="This action cannot be undone."
                        okText="Delete"
                        okButtonProps={{ danger: true }}
                        cancelText="Cancel"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <Row gutter={[16, 16]}>
                <Col xs={12} md={6}>
                    <Card variant="borderless" className="shadow-sm">
                        <Statistic
                            title="Total leads"
                            value={stats.total}
                            prefix={<BarChartOutlined />}
                            loading={loading}
                        />
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card variant="borderless" className="shadow-sm">
                        <Statistic
                            title="Contacted"
                            value={stats.contacted}
                            prefix={<FileSearchOutlined />}
                            styles={{ content: { color: "#2563eb" } }}
                            loading={loading}
                        />
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card variant="borderless" className="shadow-sm">
                        <Statistic
                            title="Converted"
                            value={stats.converted}
                            prefix={<CheckCircleTwoTone twoToneColor="#16a34a" />}
                            styles={{ content: { color: "#16a34a" } }}
                            loading={loading}
                        />
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card variant="borderless" className="shadow-sm">
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

            <Card variant="borderless" className="shadow-sm">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <Space wrap>
                        <Input
                            allowClear
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name, email, source, IP…"
                            prefix={<SearchOutlined className="text-gray-400" />}
                            style={{ width: 300 }}
                        />
                        <Select
                            value={statusFilter}
                            onChange={(v) => setStatusFilter(v)}
                            options={[
                                { value: "all", label: "All statuses" },
                                ...LEAD_STATUS_OPTIONS.map((s) => ({ value: s, label: s })),
                            ]}
                            style={{ width: 150 }}
                        />
                        <Select
                            value={sourceFilter}
                            onChange={(v) => setSourceFilter(v)}
                            options={[
                                { value: "all", label: "All sources" },
                                ...sources.map((s) => ({ value: s, label: s })),
                            ]}
                            style={{ width: 200 }}
                            placeholder="Filter by source"
                            disabled={sources.length === 0}
                        />
                    </Space>
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
                    pagination={{ pageSize: 10, showSizeChanger: true }}
                    locale={{
                        emptyText: <Empty description={loading ? "Loading…" : "No leads yet"} />,
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
        <div className="space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <Title level={2} style={{ margin: 0 }}>
                        Leads
                    </Title>
                    <Text type="secondary">
                        <CalendarOutlined className="mr-1" />
                        Manage tour bookings and website leads in one place. Every submission is
                        stamped with the visitor IP to help spot suspicious activity.
                    </Text>
                </div>
            </div>

            <Tabs
                defaultActiveKey="bookings"
                items={[
                    {
                        key: "bookings",
                        label: (
                            <span>
                                <CalendarOutlined className="mr-2" />
                                Booking Management
                            </span>
                        ),
                        children: <BookingsPanel />,
                    },
                    {
                        key: "leads",
                        label: (
                            <span>
                                <BarChartOutlined className="mr-2" />
                                Website Lead Management
                            </span>
                        ),
                        children: <LeadsPanel />,
                    },
                ]}
            />
        </div>
    );
}
