"use client";

import {
    AppstoreOutlined,
    ArrowRightOutlined,
    CalendarOutlined,
    CheckCircleTwoTone,
    EditOutlined,
    EnvironmentOutlined,
    ExportOutlined,
    EyeOutlined,
    FileSearchOutlined,
    InboxOutlined,
    PauseCircleTwoTone,
    PlusOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import {
    Alert,
    Avatar,
    Button,
    Card,
    Col,
    Empty,
    Progress,
    Row,
    Skeleton,
    Space,
    Statistic,
    Table,
    Tag,
    Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const { Title, Text } = Typography;

const ROOT = "/portal/admin/dashboard";

type TourRow = {
    id: number | string;
    title: string;
    location: string;
    price: number;
    category: string;
    status: "Active" | "Draft" | "Inactive" | string;
    image?: string;
    createdAt?: string;
};

type Stats = {
    total: number;
    active: number;
    draft: number;
    inactive: number;
    byCategory: Record<string, number>;
};

const cmsLinks: { title: string; href: string; description: string }[] = [
    { title: "Home", href: "/", description: "Hero, featured tours, CTAs, footer." },
    { title: "Sailor Moon Resorts", href: "/sailor-moon-resorts", description: "Hero, gallery, facilities, CTA." },
    { title: "Resorts Listing", href: "/resorts", description: "Hero, beach & city sections, listings." },
    { title: "Sunvia Eco Resort", href: "/sunvia-eco-resort", description: "Sections, gallery, amenities." },
    { title: "About", href: "/about", description: "Story, teams, milestones." },
    { title: "Tours", href: "/tours", description: "Active tour catalog." },
    { title: "Blog", href: "/blog", description: "Published travel stories and guides." },
];

function emptyStats(): Stats {
    return { total: 0, active: 0, draft: 0, inactive: 0, byCategory: {} };
}

function computeStats(tours: TourRow[]): Stats {
    const stats = emptyStats();
    for (const t of tours) {
        stats.total += 1;
        if (t.status === "Active") stats.active += 1;
        else if (t.status === "Draft") stats.draft += 1;
        else if (t.status === "Inactive") stats.inactive += 1;
        const cat = String(t.category || "Other");
        stats.byCategory[cat] = (stats.byCategory[cat] || 0) + 1;
    }
    return stats;
}

function fmtCurrency(n: number) {
    if (!Number.isFinite(n)) return "—";
    return `৳${Number(n).toLocaleString()}`;
}

function fmtDate(d?: string) {
    if (!d) return "—";
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function AdminDashboardPage() {
    const [tours, setTours] = useState<TourRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/tours", { cache: "no-store" });
                if (!res.ok) throw new Error("Failed to load tours");
                const data: TourRow[] = await res.json();
                if (alive) setTours(Array.isArray(data) ? data : []);
            } catch (e) {
                if (alive) setError(e instanceof Error ? e.message : "Failed to load tours");
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, []);

    const stats = useMemo(() => computeStats(tours), [tours]);

    const recentTours = useMemo(() => {
        return [...tours]
            .sort((a, b) => {
                const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return tb - ta;
            })
            .slice(0, 5);
    }, [tours]);

    const categoryRows = useMemo(() => {
        const total = stats.total || 1;
        return Object.entries(stats.byCategory)
            .map(([name, value]) => ({ name, value, percent: Math.round((value / total) * 100) }))
            .sort((a, b) => b.value - a.value);
    }, [stats]);

    const recentColumns: ColumnsType<TourRow> = [
        {
            title: "Tour",
            dataIndex: "title",
            key: "title",
            render: (text, record) => (
                <Link
                    href={`${ROOT}/tours/${record.id}`}
                    className="font-medium text-primary hover:underline"
                >
                    {text}
                </Link>
            ),
        },
        {
            title: "Location",
            dataIndex: "location",
            key: "location",
            responsive: ["md"],
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            render: (c: string) => {
                const color = c === "Domestic" ? "green" : c === "Hajj & Umrah" ? "gold" : "geekblue";
                return <Tag color={color}>{c?.toUpperCase() || "—"}</Tag>;
            },
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (s: string) => {
                const color = s === "Active" ? "success" : s === "Draft" ? "default" : "error";
                return <Tag color={color}>{s?.toUpperCase() || "—"}</Tag>;
            },
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (p: number) => fmtCurrency(p),
            responsive: ["md"],
        },
        {
            title: "Created",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (d?: string) => fmtDate(d),
            responsive: ["lg"],
        },
        {
            title: "",
            key: "action",
            width: 80,
            render: (_, record) => (
                <Space size={4}>
                    <Link href={`${ROOT}/tours/${record.id}`}>
                        <Button type="text" size="small" icon={<EyeOutlined />} />
                    </Link>
                    <Link href={`${ROOT}/tours/${record.id}/edit`}>
                        <Button type="text" size="small" icon={<EditOutlined />} />
                    </Link>
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <Title level={2} style={{ margin: 0 }}>Overview</Title>
                    <Text type="secondary">
                        Live snapshot of your catalog and quick links to inline page editors.
                    </Text>
                </div>
                <Space wrap>
                    <Link href={`${ROOT}/tours/add`}>
                        <Button type="primary" icon={<PlusOutlined />}>New Tour</Button>
                    </Link>
                    <Link href={`${ROOT}/blog/add`}>
                        <Button type="primary" icon={<PlusOutlined />}>New Post</Button>
                    </Link>
                    <Link href={`${ROOT}/tours`}>
                        <Button icon={<EnvironmentOutlined />}>Manage Tours</Button>
                    </Link>
                    <Link href={`${ROOT}/blog`}>
                        <Button icon={<EditOutlined />}>Manage Blog</Button>
                    </Link>
                    <Link href={`${ROOT}/leads`}>
                        <Button icon={<InboxOutlined />}>Leads</Button>
                    </Link>
                    <Link href={`${ROOT}/settings`}>
                        <Button icon={<SettingOutlined />}>Settings</Button>
                    </Link>
                </Space>
            </div>

            {error ? (
                <Alert
                    type="error"
                    showIcon
                    title="Could not load tour data"
                    description={error}
                />
            ) : null}

            <Row gutter={[16, 16]}>
                <Col xs={12} md={6}>
                    <Card variant="borderless" className="shadow-sm">
                        {loading ? (
                            <Skeleton active title={false} paragraph={{ rows: 2 }} />
                        ) : (
                            <Statistic
                                title="Total tours"
                                value={stats.total}
                                prefix={<AppstoreOutlined />}
                            />
                        )}
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card variant="borderless" className="shadow-sm">
                        {loading ? (
                            <Skeleton active title={false} paragraph={{ rows: 2 }} />
                        ) : (
                            <Statistic
                                title="Active"
                                value={stats.active}
                                styles={{ content: { color: "#16a34a" } }}
                                prefix={<CheckCircleTwoTone twoToneColor="#16a34a" />}
                            />
                        )}
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card variant="borderless" className="shadow-sm">
                        {loading ? (
                            <Skeleton active title={false} paragraph={{ rows: 2 }} />
                        ) : (
                            <Statistic
                                title="Drafts"
                                value={stats.draft}
                                styles={{ content: { color: "#6b7280" } }}
                                prefix={<FileSearchOutlined />}
                            />
                        )}
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card variant="borderless" className="shadow-sm">
                        {loading ? (
                            <Skeleton active title={false} paragraph={{ rows: 2 }} />
                        ) : (
                            <Statistic
                                title="Inactive"
                                value={stats.inactive}
                                styles={{ content: { color: "#dc2626" } }}
                                prefix={<PauseCircleTwoTone twoToneColor="#dc2626" />}
                            />
                        )}
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={14}>
                    <Card
                        variant="borderless"
                        className="shadow-sm"
                        title={
                            <div className="flex items-center justify-between">
                                <span>Recent tours</span>
                                <Link href={`${ROOT}/tours`} className="text-sm text-primary">
                                    View all <ArrowRightOutlined />
                                </Link>
                            </div>
                        }
                    >
                        <Table<TourRow>
                            size="middle"
                            loading={loading}
                            columns={recentColumns}
                            dataSource={recentTours.map((t) => ({ ...t, key: t.id }))}
                            pagination={false}
                            locale={{
                                emptyText: (
                                    <Empty
                                        description={loading ? "Loading…" : "No tours yet"}
                                    >
                                        {!loading ? (
                                            <Link href={`${ROOT}/tours/add`}>
                                                <Button type="primary" icon={<PlusOutlined />}>
                                                    Add your first tour
                                                </Button>
                                            </Link>
                                        ) : null}
                                    </Empty>
                                ),
                            }}
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={10}>
                    <Card
                        variant="borderless"
                        className="shadow-sm"
                        title="Catalog by category"
                    >
                        {loading ? (
                            <Skeleton active paragraph={{ rows: 4 }} />
                        ) : categoryRows.length === 0 ? (
                            <Empty description="No tours yet" />
                        ) : (
                            <div className="space-y-4">
                                {categoryRows.map((row) => (
                                    <div key={row.name}>
                                        <div className="mb-1 flex items-center justify-between text-sm">
                                            <span className="font-medium text-gray-700">{row.name}</span>
                                            <span className="text-gray-500">
                                                {row.value} · {row.percent}%
                                            </span>
                                        </div>
                                        <Progress percent={row.percent} showInfo={false} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>

            <Card
                variant="borderless"
                className="shadow-sm"
                title={
                    <div className="flex items-center justify-between">
                        <span>CMS pages (inline editors)</span>
                        <Text type="secondary" className="text-xs">
                            Open the public page → click the floating edit button
                        </Text>
                    </div>
                }
            >
                <Row gutter={[16, 16]}>
                    {cmsLinks.map((link) => (
                        <Col key={link.href} xs={24} sm={12} lg={8}>
                            <a
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block"
                            >
                                <Card
                                    hoverable
                                    className="h-full"
                                    styles={{ body: { padding: 16 } }}
                                >
                                    <Space align="start" className="w-full">
                                        <Avatar
                                            shape="square"
                                            size={40}
                                            style={{ background: "#1677ff15", color: "#1677ff" }}
                                            icon={<EditOutlined />}
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-gray-800 group-hover:text-primary">
                                                    {link.title}
                                                </span>
                                                <ExportOutlined className="text-gray-400 group-hover:text-primary" />
                                            </div>
                                            <Text type="secondary" className="text-xs">
                                                {link.description}
                                            </Text>
                                            <div className="mt-1 text-[11px] font-mono text-gray-400">
                                                {link.href}
                                            </div>
                                        </div>
                                    </Space>
                                </Card>
                            </a>
                        </Col>
                    ))}
                </Row>
            </Card>

            <Card variant="borderless" className="shadow-sm" title="Tips">
                <ul className="ml-5 list-disc space-y-1 text-sm text-base-content/70">
                    <li>Use the <CalendarOutlined /> Recent tours table to jump straight into editing.</li>
                    <li>CMS page edits live in <code>page_home</code> JSON columns and revalidate the corresponding route automatically.</li>
                    <li>Need a new field? Add it to the section data file in <code>src/lib/data/*</code> and the matching <code>EditModal</code>.</li>
                </ul>
            </Card>
        </div>
    );
}
