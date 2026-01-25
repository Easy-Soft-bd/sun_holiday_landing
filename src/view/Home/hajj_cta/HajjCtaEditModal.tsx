"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Modal, Form, Input, Button, Divider, Row, Col, Space, message, Select, Upload } from "antd";
import { SaveOutlined, PlusOutlined, DeleteOutlined, UploadOutlined, LinkOutlined } from "@ant-design/icons";

const { TextArea } = Input;

interface Inclusion {
    icon: string;
    text: string;
}

interface HajjCtaData {
    imageUrl: string;
    duration: string;
    durationLabel: string;
    mualimTitle: string;
    mualimDescription: string;
    offerBadge: string;
    titlePart1: string;
    titlePart2: string;
    description: string;
    accommodationTitle: string;
    accommodationDescription: string;
    viewDetailsLink: string;
    contactAgentLink: string;
    inclusions: Inclusion[];
}

const defaultData: HajjCtaData = {
    imageUrl: "https://images.unsplash.com/photo-1605553378313-22d0dc541393?q=80&w=1200",
    duration: "14",
    durationLabel: "Days Trip",
    mualimTitle: "Expert Mu'allim",
    mualimDescription: "Most skilled and experienced Mu'allim will accompany your entire journey.",
    offerBadge: "Take a Look at Special Offers",
    titlePart1: "UMRAH",
    titlePart2: "HAJJ PACKAGE",
    description: "Sun Holidays Ltd. ensures that you complete your long-awaited travel to the two holy cities of Makkah and Madinah with ease and spiritual focus.",
    accommodationTitle: "Accommodation Included",
    accommodationDescription: "Verified quality hotels in both Makkah and Madinah, located within walking distance to the Haram.",
    viewDetailsLink: "/packages/umrah",
    contactAgentLink: "/contact",
    inclusions: [
        { icon: "Plane", text: "Air Ticket" },
        { icon: "ShieldCheck", text: "Visa Processing" },
        { icon: "Map", text: "Transport & Ziyarah" },
        { icon: "Hotel", text: "Premium Accommodation" },
    ],
};

const LUCIDE_ICONS = ["Plane", "ShieldCheck", "Map", "Hotel", "Calendar", "UserCheck", "ArrowRight", "Star", "Wifi", "Coffee", "Waves", "Dumbbell", "Utensils", "Users"];

interface HajjCtaEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
}

export default function HajjCtaEditModal({ isOpen, onClose, initialData }: HajjCtaEditModalProps) {
    const router = useRouter();
    const [form] = Form.useForm();
    const [isSaving, setIsSaving] = useState(false);

    // Watch values for preview and upload payload
    const imageUrl = Form.useWatch("imageUrl", form);

    useEffect(() => {
        if (isOpen) {
            const mergedData = { ...defaultData, ...initialData };
            form.setFieldsValue(mergedData);
        }
    }, [isOpen, initialData, form]);

    const handleSave = async (values: HajjCtaData) => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/home-page', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ section: 'hajj_cta', data: values }),
            });

            if (response.ok) {
                message.success('Hajj CTA section updated successfully!');
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
            title="Edit Hajj/Umrah CTA Section"
            open={isOpen}
            onCancel={handleCancel}
            width={1000}
            footer={null}
            forceRender
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
                initialValues={defaultData}
            >
                <Row gutter={24}>
                    {/* Left Column */}
                    <Col span={12}>
                        <Divider titlePlacement="left">Main Content</Divider>
                        <Form.Item label="Offer Badge" name="offerBadge" rules={[{ required: true }]}>
                            <Input placeholder="Take a Look at Special Offers" />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Title Part 1" name="titlePart1" rules={[{ required: true }]}>
                                    <Input placeholder="UMRAH" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Title Part 2" name="titlePart2" rules={[{ required: true }]}>
                                    <Input placeholder="HAJJ PACKAGE" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Description" name="description" rules={[{ required: true }]}>
                            <TextArea rows={3} />
                        </Form.Item>

                        <Divider titlePlacement="left">Accommodation & Links</Divider>
                        <Form.Item label="Accommodation Title" name="accommodationTitle" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Accommodation Description" name="accommodationDescription" rules={[{ required: true }]}>
                            <TextArea rows={2} />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="View Details Link" name="viewDetailsLink" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Contact Agent Link" name="contactAgentLink" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>

                    {/* Right Column */}
                    <Col span={12}>
                        <Divider titlePlacement="left">Visuals & Floating Cards</Divider>
                        <Form.Item label="Main Image" extra="Optimized WebP will be generated. Old image will be deleted.">
                            <div className="flex flex-col gap-4">
                                <Space.Compact style={{ width: '100%' }}>
                                    <Form.Item name="imageUrl" noStyle rules={[{ required: true }]}>
                                        <Input placeholder="Image URL" />
                                    </Form.Item>
                                    {imageUrl && (
                                        <Button 
                                            type="default" 
                                            href={imageUrl} 
                                            target="_blank" 
                                            icon={<LinkOutlined />}
                                        >
                                            View
                                        </Button>
                                    )}
                                </Space.Compact>
                                <Upload
                                    name="file"
                                    action="/api/upload"
                                    data={{ oldPath: imageUrl }}
                                    showUploadList={false}
                                    onChange={(info) => {
                                        if (info.file.status === 'uploading') {
                                            setIsSaving(true);
                                            return;
                                        }
                                        if (info.file.status === 'done') {
                                            form.setFieldsValue({ imageUrl: info.file.response.url });
                                            message.success(`${info.file.name} uploaded successfully`);
                                            setIsSaving(false);
                                        } else if (info.file.status === 'error') {
                                            message.error(`${info.file.name} upload failed.`);
                                            setIsSaving(false);
                                        }
                                    }}
                                >
                                    <Button icon={<UploadOutlined />}>Upload New Image</Button>
                                </Upload>
                                {imageUrl && (
                                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-base-300">
                                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Duration (Days)" name="duration" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Duration Label" name="durationLabel" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Mu'allim Title" name="mualimTitle" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Mu'allim Description" name="mualimDescription" rules={[{ required: true }]}>
                            <TextArea rows={2} />
                        </Form.Item>

                        <Divider titlePlacement="left">Inclusions</Divider>
                        <Form.List name="inclusions">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                            <Form.Item {...restField} name={[name, 'icon']} rules={[{ required: true, message: 'Icon' }]}>
                                                <Select placeholder="Icon" style={{ width: 120 }}>
                                                    {LUCIDE_ICONS.map(icon => (
                                                        <Select.Option key={icon} value={icon}>{icon}</Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, 'text']} rules={[{ required: true, message: 'Text' }]}>
                                                <Input placeholder="Air Ticket" style={{ width: 220 }} />
                                            </Form.Item>
                                            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                                        </Space>
                                    ))}
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Add Inclusion</Button>
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
