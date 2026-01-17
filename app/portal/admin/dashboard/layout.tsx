"use client";

import React, { useState } from 'react';
import { Layout, Menu, Button, theme, Space, Dropdown, Avatar } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    EnvironmentOutlined,
    BarChartOutlined,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const { Header, Sider, Content } = Layout;

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const menuItems = [
        {
            key: '/portal/admin/dashboard',
            icon: <DashboardOutlined />,
            label: <Link href="/portal/admin/dashboard">Dashboard</Link>,
        },
        {
            key: '/portal/admin/tours',
            icon: <EnvironmentOutlined />,
            label: <Link href="/portal/admin/tours">Tours</Link>,
        },
        {
            key: '/portal/admin/bookings',
            icon: <BarChartOutlined />,
            label: <Link href="/portal/admin/bookings">Bookings</Link>,
        },
        {
            key: '/portal/admin/users',
            icon: <UserOutlined />,
            label: <Link href="/portal/admin/users">Users</Link>,
        },
        {
            key: '/portal/admin/settings',
            icon: <SettingOutlined />,
            label: <Link href="/portal/admin/settings">Settings</Link>,
        },
    ];

    const userMenuItems = [
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed} theme="light" className="shadow-md">
                <div className="flex items-center justify-center h-16 border-b border-gray-100">
                    <span className="text-xl font-bold text-primary">
                        {collapsed ? 'SH' : 'Sun Holidays'}
                    </span>
                </div>
                <Menu
                    theme="light"
                    mode="inline"
                    defaultSelectedKeys={[pathname]}
                    items={menuItems}
                    style={{ borderRight: 0, marginTop: 16 }}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 24 }} className="shadow-sm">
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                    <Space size="large">
                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                            <Space className="cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                                <Avatar icon={<UserOutlined />} />
                                <span className="hidden sm:inline font-medium text-gray-700">Admin User</span>
                            </Space>
                        </Dropdown>
                    </Space>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
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
