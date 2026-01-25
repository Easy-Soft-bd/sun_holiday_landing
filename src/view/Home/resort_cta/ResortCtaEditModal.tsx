"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Modal, Form, Input, Button, Divider, Row, Col, Space, message, Select, Upload } from "antd";
import { SaveOutlined, PlusOutlined, DeleteOutlined, UploadOutlined, LinkOutlined } from "@ant-design/icons";

const { TextArea } = Input;

interface RoomDetail {
    label: string;
    count: number;
    size: string;
}

interface Amenity {
    icon: string; // Store icon name as string
    label: string;
}

interface ResortCtaData {
    imageUrl: string;
    locationText: string;
    trustCardTitle: string;
    trustCardSubtitle: string;
    subHeadline: string;
    titlePart1: string;
    titlePart2: string;
    description: string;
    ctaButtonText: string;
    ctaButtonLink: string;
    roomDetails: RoomDetail[];
    amenities: Amenity[];
}

const defaultData: ResortCtaData = {
    imageUrl: "/Sun-Holidays-Leaflet-Editable.jpg",
    locationText: "Inani Beach, Marine Drive Road",
    trustCardTitle: "5-STAR",
    trustCardSubtitle: "Standard Resort",
    subHeadline: "Take Experience To Our 5 Star Hotel",
    titlePart1: "GRANDEUR",
    titlePart2: "BLISS",
    description: "A state-of-the-art luxury escape by Sun Holidays Ltd. Nestled adjacent to the serene Inani Beach, we offer a world of sophistication and coastal tranquility.",
    ctaButtonText: "Details & Booking",
    ctaButtonLink: "/hotel/grandeur-bliss",
    roomDetails: [
        { label: "Deluxe Rooms", count: 200, size: "425 sq. ft." },
        { label: "Suite Rooms", count: 30, size: "550 sq. ft." },
        { label: "Family Suites", count: 15, size: "675 sq. ft." },
        { label: "Presidential", count: 5, size: "1500 sq. ft." },
    ],
    amenities: [
        { icon: "Waves", label: "Huge Pool" },
        { icon: "Dumbbell", label: "Gym & Spa" },
        { icon: "Utensils", label: "Buffet & BBQ" },
        { icon: "Users", label: "Conf. Room" },
        { icon: "Coffee", label: "Coffee Shop" },
    ],
};

// Available icons from Lucide
const LUCIDE_ICONS = ["Waves", "Dumbbell", "Utensils", "Users", "Coffee", "Hotel", "MapPin", "ChevronRight", "Star", "Wifi", "Tv", "Wind"];

interface ResortCtaEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
}

export default function ResortCtaEditModal({ isOpen, onClose, initialData }: ResortCtaEditModalProps) {
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

    const handleSave = async (values: ResortCtaData) => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/home-page', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ section: 'resort_cta', data: values }),
            });

            if (response.ok) {
                message.success('Resort section updated successfully!');
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
            title="Edit Resort CTA Section"
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
                    {/* Left Column - Main Details */}
                    <Col span={12}>
                        <Divider titlePlacement="left">Main Content</Divider>
                        <Form.Item label="Sub Headline" name="subHeadline" rules={[{ required: true }]}>
                            <Input placeholder="Take Experience To Our 5 Star Hotel" />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Title Part 1" name="titlePart1" rules={[{ required: true }]}>
                                    <Input placeholder="GRANDEUR" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Title Part 2" name="titlePart2" rules={[{ required: true }]}>
                                    <Input placeholder="BLISS" />
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

                        <Divider titlePlacement="left">Visuals & Badge</Divider>
                        <Form.Item label="Image" extra="Optimized WebP will be generated. Old image will be deleted.">
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
                                            const url = info.file.response.url;
                                            form.setFieldsValue({ imageUrl: url });
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
                                        <img 
                                            src={imageUrl} 
                                            alt="Preview" 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        </Form.Item>
                        <Form.Item label="Location Text" name="locationText" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Trust Card Title" name="trustCardTitle" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Trust Card Subtitle" name="trustCardSubtitle" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>

                    {/* Right Column - Lists */}
                    <Col span={12}>
                        <Divider titlePlacement="left">Room Details</Divider>
                        <Form.List name="roomDetails">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                            <Form.Item {...restField} name={[name, 'label']} rules={[{ required: true, message: 'Label' }]}>
                                                <Input placeholder="Label" style={{ width: 120 }} />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, 'count']} rules={[{ required: true, message: 'Count' }]}>
                                                <Input type="number" placeholder="Count" style={{ width: 80 }} />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, 'size']} rules={[{ required: true, message: 'Size' }]}>
                                                <Input placeholder="Size" style={{ width: 100 }} />
                                            </Form.Item>
                                            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                                        </Space>
                                    ))}
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Add Room Type</Button>
                                </>
                            )}
                        </Form.List>

                        <Divider titlePlacement="left">Amenities</Divider>
                        <Form.List name="amenities">
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
                                            <Form.Item {...restField} name={[name, 'label']} rules={[{ required: true, message: 'Label' }]}>
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
