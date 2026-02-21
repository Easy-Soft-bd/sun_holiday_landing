"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Modal, Form, Input, Button, Divider, Row, Col, Space, message, Select, Upload } from "antd";
import { SaveOutlined, PlusOutlined, DeleteOutlined, UploadOutlined, LinkOutlined } from "@ant-design/icons";

const { TextArea } = Input;

interface Amenity {
    icon: string;
    label: string;
}

interface SailorMoonCtaData {
    bgImageUrl: string;
    promoImageUrl: string;
    locationText: string;
    subHeadline: string;
    titlePart1: string;
    titlePart2: string;
    description: string;
    ctaButtonText: string;
    ctaButtonLink: string;
    amenities: Amenity[];
}

const defaultData: SailorMoonCtaData = {
    bgImageUrl: "/sailor/sailor_ (21).jpg",
    promoImageUrl: "/sailor/Sailor_Room_1.jpg",
    locationText: "Inani Beach, Marine Drive Road",
    subHeadline: "Where The Sea Meets The Celestial Splendor",
    titlePart1: "SAILOR",
    titlePart2: "MOON",
    description: "Discover a realm of magic at Sailor Moon Resort. A boutique luxury experience designed for those who seek tranquility under the moonlit waves of Cox's Bazar.",
    ctaButtonText: "Book Your Escape",
    ctaButtonLink: "/hotel/sailor-moon",
    amenities: [
        { icon: "Sunset", label: "Beach Front" },
        { icon: "Waves", label: "Infinity Pool" },
        { icon: "Palmtree", label: "Tropical Garden" },
        { icon: "Sparkles", label: "Star Gazing" },
    ],
};

const LUCIDE_ICONS = ["Sunset", "Waves", "Palmtree", "Sparkles", "Moon", "Stars", "Navigation", "Hotel", "MapPin", "Coffee", "Wifi", "Wind"];

interface SailorMoonCtaEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
}

export default function SailorMoonCtaEditModal({ isOpen, onClose, initialData }: SailorMoonCtaEditModalProps) {
    const router = useRouter();
    const [form] = Form.useForm();
    const [isSaving, setIsSaving] = useState(false);

    const bgImageUrl = Form.useWatch("bgImageUrl", form);
    const promoImageUrl = Form.useWatch("promoImageUrl", form);

    useEffect(() => {
        if (isOpen) {
            const mergedData = { ...defaultData, ...initialData };
            form.setFieldsValue(mergedData);
        }
    }, [isOpen, initialData, form]);

    const handleSave = async (values: SailorMoonCtaData) => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/home-page', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ section: 'sailor_moon_cta', data: values }),
            });

            if (response.ok) {
                message.success('Sailor Moon section updated successfully!');
                router.refresh();
                onClose();
            } else {
                message.error('Failed to save changes');
            }
        } catch (error) {
            console.error('Error saving:', error);
            message.error('Error saving changes');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title="Edit Sailor Moon CTA Section"
            open={isOpen}
            onCancel={handleCancel}
            width={1000}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
                initialValues={defaultData}
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Divider titlePlacement="left">Main Content</Divider>
                        <Form.Item label="Sub Headline" name="subHeadline" rules={[{ required: true }]}>
                            <Input placeholder="Where The Sea Meets The Celestial Splendor" />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Title Part 1" name="titlePart1" rules={[{ required: true }]}>
                                    <Input placeholder="SAILOR" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Title Part 2" name="titlePart2" rules={[{ required: true }]}>
                                    <Input placeholder="MOON" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Description" name="description" rules={[{ required: true }]}>
                            <TextArea rows={4} />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="CTA Button Text" name="ctaButtonText" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="CTA Button Link" name="ctaButtonLink" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Location Text" name="locationText" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Divider titlePlacement="left">Visual Elements</Divider>
                        
                        {/* Background Image */}
                        <Form.Item label="Background Image">
                            <Space.Compact style={{ width: '100%' }}>
                                <Form.Item name="bgImageUrl" noStyle rules={[{ required: true }]}>
                                    <Input placeholder="Background Image URL" />
                                </Form.Item>
                                {bgImageUrl && (
                                    <Button type="default" href={bgImageUrl} target="_blank" icon={<LinkOutlined />}>View</Button>
                                )}
                            </Space.Compact>
                            <Upload
                                name="file"
                                action="/api/upload"
                                data={{ oldPath: bgImageUrl }}
                                showUploadList={false}
                                onChange={(info) => {
                                    if (info.file.status === 'done') {
                                        form.setFieldsValue({ bgImageUrl: info.file.response.url });
                                        message.success(`Background uploaded successfully`);
                                    }
                                }}
                            >
                                <Button icon={<UploadOutlined />} style={{ marginTop: 8 }}>Upload Background</Button>
                            </Upload>
                        </Form.Item>

                        {/* Promo Image */}
                        <Form.Item label="Promo Image (Side/Top Photo)">
                            <Space.Compact style={{ width: '100%' }}>
                                <Form.Item name="promoImageUrl" noStyle rules={[{ required: true }]}>
                                    <Input placeholder="Promo Image URL" />
                                </Form.Item>
                                {promoImageUrl && (
                                    <Button type="default" href={promoImageUrl} target="_blank" icon={<LinkOutlined />}>View</Button>
                                )}
                            </Space.Compact>
                            <Upload
                                name="file"
                                action="/api/upload"
                                data={{ oldPath: promoImageUrl }}
                                showUploadList={false}
                                onChange={(info) => {
                                    if (info.file.status === 'done') {
                                        form.setFieldsValue({ promoImageUrl: info.file.response.url });
                                        message.success(`Promo image uploaded successfully`);
                                    }
                                }}
                            >
                                <Button icon={<UploadOutlined />} style={{ marginTop: 8 }}>Upload Promo Image</Button>
                            </Upload>
                        </Form.Item>

                        <Divider titlePlacement="left">Amenities</Divider>
                        <Form.List name="amenities">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                            <Form.Item {...restField} name={[name, 'icon']} rules={[{ required: true }]}>
                                                <Select placeholder="Icon" style={{ width: 120 }}>
                                                    {LUCIDE_ICONS.map(icon => (
                                                        <Select.Option key={icon} value={icon}>{icon}</Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, 'label']} rules={[{ required: true }]}>
                                                <Input placeholder="Label" style={{ width: 220 }} />
                                            </Form.Item>
                                            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                                        </Space>
                                    ))}
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Add Amenity</Button>
                                </>
                            )}
                        </Form.List>
                    </Col>
                </Row>

                <Form.Item className="mb-0 mt-8">
                    <div className="flex justify-end gap-2">
                        <Button onClick={handleCancel}>Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={isSaving} icon={<SaveOutlined />}>
                            Save Changes
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
}
