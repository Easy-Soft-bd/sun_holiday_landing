"use client";

import { useState } from "react";
import { Form, Input, Button, Checkbox, Card, Typography, Space, App } from "antd";
import { UserOutlined, LockOutlined, ArrowRightOutlined } from "@ant-design/icons";
import Link from "next/link";
import Logo from "@/src/components/common/Logo";

const { Title, Text } = Typography;

export default function AdminLoginPage() {
    const [isLoading, setIsLoading] = useState(false);

    const onFinish = async (values: any) => {
        setIsLoading(true);
        console.log("Success:", values);
        // Add login logic here later
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#f0f2f5] to-[#d9d9d9]">
            <div className="w-full max-w-md">
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-4 hover:opacity-80 transition-opacity">
                        <Logo width={80} height={80} showText={false} />
                    </Link>
                    <Title level={2} className="!mb-0 !font-magmawave">Admin Portal</Title>
                    <Text type="secondary">Welcome back! Please enter your details.</Text>
                </div>

                {/* Login Card */}
                <Card 
                    variant="borderless" 
                    className="shadow-2xl !rounded-xl overflow-hidden"
                    styles={{ body: { padding: '40px' } }}
                >
                    <Form
                        name="admin_login"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        layout="vertical"
                        size="large"
                        requiredMark={false}
                    >
                        <Form.Item
                            name="email"
                            label={<Text strong>Email Address</Text>}
                            rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
                        >
                            <Input 
                                prefix={<UserOutlined className="text-gray-400" />} 
                                placeholder="admin@sunholidays.com" 
                                className="!rounded-md"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label={<Text strong>Password</Text>}
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-gray-400" />}
                                placeholder="••••••••"
                                className="!rounded-md"
                            />
                        </Form.Item>

                        <div className="flex items-center justify-between mb-6">
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>
                            <Link href="#" className="text-sm text-primary hover:underline font-medium">
                                Forgot password?
                            </Link>
                        </div>

                        <Form.Item className="mb-0">
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isLoading}
                                block
                                icon={<ArrowRightOutlined />}
                                className="!h-12 !rounded-md shadow-lg shadow-primary/20 !bg-primary border-none text-white hover:!bg-primary/90"
                            >
                                Sign In
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>

                {/* Footer Links */}
                <div className="text-center mt-8">
                    <Text type="secondary" className="text-sm">
                        &copy; {new Date().getFullYear()} Sun Holidays Ltd. All rights reserved.
                    </Text>
                    <div className="mt-4 flex items-center justify-center gap-4 text-xs font-medium">
                        <Link href="/" className="text-gray-400 hover:text-primary transition-colors">Main Site</Link>
                        <span className="text-gray-300">|</span>
                        <Link href="#" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</Link>
                        <span className="text-gray-300">|</span>
                        <Link href="#" className="text-gray-400 hover:text-primary transition-colors">Support</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
