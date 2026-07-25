"use client";

import React, { useMemo, useState } from "react";
import {
    Avatar,
    Breadcrumb,
    Button,
    Drawer,
    Dropdown,
    Grid,
    Layout,
    Menu,
    Space,
    Tag,
    Tooltip,
    message,
    theme,
} from "antd";
import type { MenuProps } from "antd";
import {
    AppstoreOutlined,
    BarChartOutlined,
    DashboardOutlined,
    EditOutlined,
    EnvironmentOutlined,
    ExportOutlined,
    HomeOutlined,
    InboxOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PlusOutlined,
    ReadOutlined,
    SettingOutlined,
    StarOutlined,
    UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useGetMeQuery, useLogoutMutation } from "@/src/lib/redux/api/userApi";

const { Header, Sider, Content } = Layout;

type SidebarItem = NonNullable<MenuProps["items"]>[number];

const ROOT = "/portal/admin/dashboard";

const cmsPages: { key: string; label: string; href: string }[] = [
    { key: "cms-home", label: "Home", href: "/" },
    { key: "cms-sailor", label: "Sailor Moon Resorts", href: "/sailor-moon-resorts" },
    { key: "cms-resorts", label: "Resorts Listing", href: "/resorts" },
    { key: "cms-sunvia-eco", label: "Sunvia Eco Resort", href: "/sunvia-eco-resort" },
    { key: "cms-about", label: "About", href: "/about" },
    { key: "cms-tours", label: "Tours", href: "/tours" },
    { key: "cms-blog", label: "Blog", href: "/blog" },
];

function buildMenuItems(): SidebarItem[] {
    return [
        {
            key: ROOT,
            icon: <DashboardOutlined />,
            label: <Link href={ROOT}>Overview</Link>,
        },
        {
            key: `${ROOT}/tours`,
            icon: <EnvironmentOutlined />,
            label: <Link href={`${ROOT}/tours`}>Tours</Link>,
        },
        {
            key: `${ROOT}/blog`,
            icon: <ReadOutlined />,
            label: <Link href={`${ROOT}/blog`}>Blog</Link>,
        },
        {
            key: `${ROOT}/leads`,
            icon: <InboxOutlined />,
            label: <Link href={`${ROOT}/leads`}>Leads</Link>,
        },
        {
            type: "divider",
        },
        {
            key: "cms",
            icon: <EditOutlined />,
            label: "Pages (inline edit)",
            children: cmsPages.map(({ key, label, href }) => ({
                key,
                label: (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-2">
                        <span>{label}</span>
                        <ExportOutlined className="text-xs opacity-60" />
                    </a>
                ),
            })),
        },
        {
            type: "divider",
        },
        {
            key: `${ROOT}/settings`,
            icon: <SettingOutlined />,
            label: <Link href={`${ROOT}/settings`}>Settings</Link>,
        },
        {
            key: `${ROOT}/icons`,
            icon: <StarOutlined />,
            label: <Link href={`${ROOT}/icons`}>Icon library</Link>,
        },
        {
            key: "coming-soon",
            icon: <AppstoreOutlined />,
            label: "Coming soon",
            children: [
                {
                    key: "users",
                    icon: <UserOutlined />,
                    label: <Tooltip title="Module not built yet"><span className="text-base-content/60">Users</span></Tooltip>,
                    disabled: true,
                },
                {
                    key: "analytics",
                    icon: <BarChartOutlined />,
                    label: <Tooltip title="Module not built yet"><span className="text-base-content/60">Analytics</span></Tooltip>,
                    disabled: true,
                },
            ],
        },
    ];
}

const breadcrumbLabels: Record<string, string> = {
    portal: "Portal",
    admin: "Admin",
    dashboard: "Dashboard",
    tours: "Tours",
    blog: "Blog",
    leads: "Leads",
    bookings: "Booking",
    add: "Add",
    edit: "Edit",
    settings: "Settings",
    icons: "Icon library",
};

function buildBreadcrumb(pathname: string) {
    const parts = pathname.split("/").filter(Boolean);
    const items = [
        { href: "/", title: <HomeOutlined /> },
    ];
    let acc = "";
    for (const p of parts) {
        acc += `/${p}`;
        const label = breadcrumbLabels[p] ?? p;
        items.push({
            href: acc,
            title: <span className="capitalize">{label}</span>,
        });
    }
    return items;
}

function selectedKeyForPath(pathname: string): string {
    if (pathname === ROOT) {
        return ROOT;
    }
    if (pathname.startsWith(`${ROOT}/tours`)) {
        return `${ROOT}/tours`;
    }
    if (pathname.startsWith(`${ROOT}/blog`)) {
        return `${ROOT}/blog`;
    }
    if (pathname.startsWith(`${ROOT}/leads`)) {
        return `${ROOT}/leads`;
    }
    if (pathname.startsWith(`${ROOT}/settings`)) {
        return `${ROOT}/settings`;
    }
    if (pathname.startsWith(`${ROOT}/icons`)) {
        return `${ROOT}/icons`;
    }
    return ROOT;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname() || ROOT;
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md;

    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const { data: meData } = useGetMeQuery({});
    const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

    const {
        token: { colorBgContainer, borderRadiusLG, colorBorderSecondary },
    } = theme.useToken();

    const menuItems = useMemo(() => buildMenuItems(), []);
    const selectedKey = useMemo(() => selectedKeyForPath(pathname), [pathname]);
    const breadcrumbItems = useMemo(() => buildBreadcrumb(pathname), [pathname]);

    const userEmail: string | undefined = meData?.user?.email;
    const userInitial = (userEmail?.[0] || "A").toUpperCase();

    const handleLogout = async () => {
        try {
            await logout({}).unwrap();
            message.success("Signed out");
            router.push("/portal/admin/login");
            router.refresh();
        } catch {
            message.error("Failed to sign out");
        }
    };

    const userMenu: MenuProps["items"] = [
        {
            key: "email",
            disabled: true,
            label: (
                <div className="text-xs text-base-content/60">
                    Signed in as <span className="font-semibold text-base-content">{userEmail || "—"}</span>
                </div>
            ),
        },
        { type: "divider" },
        {
            key: "site",
            icon: <ExportOutlined />,
            label: (
                <a href="/" target="_blank" rel="noopener noreferrer">
                    Open public site
                </a>
            ),
        },
        {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "Logout",
            danger: true,
            onClick: () => void handleLogout(),
        },
    ];

    const sidebarBrand = (collapsedView: boolean) => (
        <Link
            href={ROOT}
            className="flex h-16 items-center justify-center border-b text-base font-bold tracking-tight text-primary"
            style={{ borderColor: colorBorderSecondary }}
        >
            <span>{collapsedView ? "SH" : "Sun Tourism"}</span>
        </Link>
    );

    const sidebarMenu = (
        <Menu
            theme="light"
            mode="inline"
            selectedKeys={[selectedKey]}
            defaultOpenKeys={[]}
            items={menuItems}
            style={{ borderRight: 0, marginTop: 8 }}
            onClick={() => {
                if (isMobile) {
                    setMobileOpen(false);
                }
            }}
        />
    );

    return (
        <Layout style={{ minHeight: "100vh" }}>
            {!isMobile && (
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    theme="light"
                    width={240}
                    className="shadow-sm"
                    style={{ borderRight: `1px solid ${colorBorderSecondary}` }}
                >
                    {sidebarBrand(collapsed)}
                    {sidebarMenu}
                </Sider>
            )}

            <Drawer
                open={isMobile && mobileOpen}
                placement="left"
                onClose={() => setMobileOpen(false)}
                size="default"
                styles={{ body: { padding: 0 }, header: { display: "none" } }}
            >
                {sidebarBrand(false)}
                {sidebarMenu}
            </Drawer>

            <Layout>
                <Header
                    style={{
                        background: colorBgContainer,
                        padding: 0,
                        position: "sticky",
                        top: 0,
                        zIndex: 10,
                        borderBottom: `1px solid ${colorBorderSecondary}`,
                    }}
                    className="flex items-center justify-between gap-4 pr-4 md:pr-6"
                >
                    <div className="flex items-center gap-2">
                        <Button
                            type="text"
                            icon={
                                isMobile
                                    ? mobileOpen
                                        ? <MenuFoldOutlined />
                                        : <MenuUnfoldOutlined />
                                    : collapsed
                                        ? <MenuUnfoldOutlined />
                                        : <MenuFoldOutlined />
                            }
                            onClick={() => {
                                if (isMobile) {
                                    setMobileOpen((v) => !v);
                                } else {
                                    setCollapsed((v) => !v);
                                }
                            }}
                            style={{ fontSize: 16, width: 56, height: 56 }}
                        />
                        <Breadcrumb items={breadcrumbItems} className="hidden sm:block" />
                    </div>

                    <Space size="small" className="flex items-center">
                        <Link href={`${ROOT}/tours/add`} className="hidden sm:inline-flex">
                            <Button type="primary" icon={<PlusOutlined />} size="middle">
                                New Tour
                            </Button>
                        </Link>
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden md:inline-flex"
                        >
                            <Button icon={<ExportOutlined />}>View site</Button>
                        </a>
                        <Dropdown menu={{ items: userMenu }} placement="bottomRight" trigger={["click"]}>
                            <Space className="cursor-pointer rounded-lg px-3 py-2 transition-colors hover:bg-gray-50">
                                <Avatar style={{ background: "#1677ff" }}>{userInitial}</Avatar>
                                <span className="hidden font-medium text-gray-700 sm:inline">
                                    {userEmail ? userEmail.split("@")[0] : "Admin"}
                                </span>
                                {isLoggingOut ? <Tag color="gold">…</Tag> : null}
                            </Space>
                        </Dropdown>
                    </Space>
                </Header>

                <Content
                    style={{
                        margin: "16px 12px 24px",
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}
