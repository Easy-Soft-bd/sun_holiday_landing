"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Modal, Form, Input, Button, Divider, Row, Col, Space, message, Select, Upload } from "antd";
import { SaveOutlined, PlusOutlined, DeleteOutlined, UploadOutlined, LinkOutlined } from "@ant-design/icons";
import IconPicker from "@/src/components/common/IconPicker";

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
    badgeText: string;
    badgeIcon: string;
    galleryButtonText: string;
    galleryButtonLink: string;
    galleryButtonIcon: string;
    floatingIcon: string;
    promoImageTitle: string;
    promoImageSubtitle: string;
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
        { icon: "LuSun", label: "Beach Front" },
        { icon: "LuWaves", label: "Infinity Pool" },
        { icon: "LuPalmtree", label: "Tropical Garden" },
        { icon: "LuSparkles", label: "Star Gazing" },
    ],
    badgeText: "New Escape",
    badgeIcon: "LuSparkles",
    galleryButtonText: "Experience Gallery",
    galleryButtonLink: "#view-gallery",
    galleryButtonIcon: "LuNavigation",
    floatingIcon: "LuStars",
    promoImageTitle: "Ocean View Premier Room",
    promoImageSubtitle: "Experience celestial luxury in every corner.",
};

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

                        <Divider titlePlacement="left">Badge & Location</Divider>
                        <Row gutter={16}>
                            <Col span={16}>
                                <Form.Item label="Badge Text" name="badgeText" rules={[{ required: true }]}>
                                    <Input placeholder="New Escape" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Badge Icon" name="badgeIcon" rules={[{ required: true }]}>
                                    <IconPicker />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Location Text" name="locationText" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>

                        <Divider titlePlacement="left">Experience Gallery</Divider>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Gallery Text" name="galleryButtonText" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Gallery Link" name="galleryButtonLink" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item label="Gallery Icon" name="galleryButtonIcon" rules={[{ required: true }]}>
                            <IconPicker />
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

                            <Form.Item label="Promo Title" name="promoImageTitle" style={{ marginTop: 16 }}>
                                <Input placeholder="Ocean View Premier Room" />
                            </Form.Item>
                            <Form.Item label="Promo Subtitle" name="promoImageSubtitle">
                                <Input placeholder="Experience celestial luxury..." />
                            </Form.Item>
                        </Form.Item>

                        <Form.Item label="Floating Decorative Icon" name="floatingIcon" rules={[{ required: true }]}>
                            <IconPicker />
                        </Form.Item>

                        <Divider titlePlacement="left">Amenities</Divider>
                        <Form.List name="amenities">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                            <Form.Item {...restField} name={[name, 'icon']} rules={[{ required: true }]}>
                                                <IconPicker placeholder="Icon" />
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
