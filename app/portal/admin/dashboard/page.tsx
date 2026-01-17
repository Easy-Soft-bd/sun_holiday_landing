"use client";

import { Typography, Card, Row, Col, Statistic } from "antd";
import { 
    DashboardOutlined, 
    UserOutlined, 
    EnvironmentOutlined, 
    BarChartOutlined 
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function AdminDashboardPage() {
    return (
        <div>
            <Title level={2}>Admin Dashboard</Title>
            <Text type="secondary">Welcome to the Sun Holidays admin portal. Here you can manage your tours, bookings, and users.</Text>
            
            <Row gutter={16} className="mt-8">
                <Col span={6}>
                    <Card variant="borderless" className="shadow-sm hover:shadow-md transition-shadow">
                        <Statistic
                            title="Active Tours"
                            value={12}
                            prefix={<EnvironmentOutlined />}
                            styles={{ content: { color: '#fa8c16' } }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card variant="borderless" className="shadow-sm hover:shadow-md transition-shadow">
                        <Statistic
                            title="Total Bookings"
                            value={48}
                            prefix={<BarChartOutlined />}
                            styles={{ content: { color: '#1890ff' } }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card variant="borderless" className="shadow-sm hover:shadow-md transition-shadow">
                        <Statistic
                            title="Platform Users"
                            value={156}
                            prefix={<UserOutlined />}
                            styles={{ content: { color: '#3f8600' } }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card variant="borderless" className="shadow-sm hover:shadow-md transition-shadow">
                        <Statistic
                            title="System Status"
                            value={"Healthy"}
                            prefix={<DashboardOutlined />}
                            styles={{ content: { color: '#52c41a' } }}
                        />
                    </Card>
                </Col>
            </Row>

            <div className="mt-12 p-12 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <Title level={4} type="secondary">Quick Stats & Recent Activity Coming Soon</Title>
            </div>
        </div>
    );
}
