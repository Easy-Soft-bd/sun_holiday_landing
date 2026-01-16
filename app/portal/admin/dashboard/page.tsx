"use client";

import { Layout, Typography, Card, Row, Col, Statistic, Breadcrumb } from "antd";
import { 
    DashboardOutlined, 
    UserOutlined, 
    EnvironmentOutlined, 
    BarChartOutlined 
} from "@ant-design/icons";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function AdminDashboardPage() {
    return (
        <Content style={{ padding: '0 50px', marginTop: 64 }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Admin</Breadcrumb.Item>
                <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            </Breadcrumb>
            
            <div className="bg-white p-8 min-h-[80vh] rounded-lg shadow-sm">
                <Title level={2}>Admin Dashboard</Title>
                <Text type="secondary">Welcome to the Sun Holidays admin portal. Here you can manage your tours, bookings, and users.</Text>
                
                <Row gutter={16} className="mt-8">
                    <Col span={6}>
                        <Card variant="borderless" className="shadow-sm hover:shadow-md transition-shadow">
                            <Statistic
                                title="Active Tours"
                                value={12}
                                prefix={<EnvironmentOutlined />}
                                valueStyle={{ color: '#fa8c16' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card variant="borderless" className="shadow-sm hover:shadow-md transition-shadow">
                            <Statistic
                                title="Total Bookings"
                                value={48}
                                prefix={<BarChartOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card variant="borderless" className="shadow-sm hover:shadow-md transition-shadow">
                            <Statistic
                                title="Platform Users"
                                value={156}
                                prefix={<UserOutlined />}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card variant="borderless" className="shadow-sm hover:shadow-md transition-shadow">
                            <Statistic
                                title="System Status"
                                value={"Healthy"}
                                prefix={<DashboardOutlined />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                </Row>

                <div className="mt-12 p-12 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <Title level={4} type="secondary">Quick Stats & Recent Activity Coming Soon</Title>
                </div>
            </div>
        </Content>
    );
}
