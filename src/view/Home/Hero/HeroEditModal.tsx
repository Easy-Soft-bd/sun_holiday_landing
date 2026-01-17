"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Modal, Form, Input, Button, Divider, Row, Col, message } from "antd";
import { SaveOutlined } from "@ant-design/icons";

const { TextArea } = Input;

interface HeroData {
    badgeText: string;
    titlePart1: string;
    titlePart2: string;
    titlePart3: string;
    description: string;
    button1Text: string;
    button1Link: string;
    button2Text: string;
    button2Link: string;
    stat1Count: string;
    stat1Label: string;
    stat2Count: string;
    stat2Label: string;
    stat3Count: string;
    stat3Label: string;
    videoSrc: string;
    backgroundImage: string;
}

const defaultData: HeroData = {
    badgeText: "Explore the Unexplored",
    titlePart1: "SUN",
    titlePart2: "HOLIDAYS",
    titlePart3: "LTD",
    description: "Experience world-class travel with Sun Holidays Ltd. From exotic beaches to mountain retreats, we curate memories that last a lifetime.",
    button1Text: "Find a Destination",
    button1Link: "/destinations",
    button2Text: "Watch Story",
    button2Link: "#",
    stat1Count: "500+",
    stat1Label: "Destinations",
    stat2Count: "12k+",
    stat2Label: "Happy Travelers",
    stat3Count: "24/7",
    stat3Label: "Support",
    videoSrc: "/hero/hero-video.mp4",
    backgroundImage: "/hero/hero.jpg"
};

interface HeroEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
}

export default function HeroEditModal({ isOpen, onClose, initialData }: HeroEditModalProps) {
    const router = useRouter();
    const [form] = Form.useForm();
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const mergedData = { ...defaultData, ...initialData };
            form.setFieldsValue(mergedData);
        }
    }, [isOpen, initialData, form]);

    const handleSave = async (values: HeroData) => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/home-page', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ section: 'hero', data: values }),
            });

            if (response.ok) {
                message.success('Hero section updated successfully!');
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
            title="Edit Hero Section"
            open={isOpen}
            onCancel={handleCancel}
            width={900}
            footer={null}
            destroyOnHidden
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
                initialValues={defaultData}
            >
                {/* Badge */}
                <Form.Item
                    label="Badge Text"
                    name="badgeText"
                    rules={[{ required: true, message: 'Please enter badge text' }]}
                >
                    <Input placeholder="Enter badge text" />
                </Form.Item>

                {/* Title */}
                <Row gutter={16}>
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="Title Part 1"
                            name="titlePart1"
                            rules={[{ required: true, message: 'Please enter title part 1' }]}
                        >
                            <Input placeholder="Enter title part 1" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="Title Part 2 (Highlighted)"
                            name="titlePart2"
                            rules={[{ required: true, message: 'Please enter title part 2' }]}
                        >
                            <Input placeholder="Enter title part 2" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="Title Part 3"
                            name="titlePart3"
                            rules={[{ required: true, message: 'Please enter title part 3' }]}
                        >
                            <Input placeholder="Enter title part 3" />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Description */}
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please enter description' }]}
                >
                    <TextArea 
                        rows={4} 
                        placeholder="Enter description"
                    />
                </Form.Item>

                {/* Buttons */}
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Button 1 Text"
                            name="button1Text"
                            rules={[{ required: true, message: 'Please enter button 1 text' }]}
                        >
                            <Input placeholder="Enter button 1 text" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Button 1 Link"
                            name="button1Link"
                            rules={[{ required: true, message: 'Please enter button 1 link' }]}
                        >
                            <Input placeholder="Enter button 1 link" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Button 2 Text"
                            name="button2Text"
                            rules={[{ required: true, message: 'Please enter button 2 text' }]}
                        >
                            <Input placeholder="Enter button 2 text" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Button 2 Link"
                            name="button2Link"
                            rules={[{ required: true, message: 'Please enter button 2 link' }]}
                        >
                            <Input placeholder="Enter button 2 link" />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Stats */}
                <Divider>Statistics</Divider>
                <Row gutter={16}>
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="Stat 1 Count"
                            name="stat1Count"
                            rules={[{ required: true, message: 'Please enter stat 1 count' }]}
                        >
                            <Input placeholder="e.g., 500+" />
                        </Form.Item>
                        <Form.Item
                            label="Stat 1 Label"
                            name="stat1Label"
                            rules={[{ required: true, message: 'Please enter stat 1 label' }]}
                        >
                            <Input placeholder="e.g., Destinations" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="Stat 2 Count"
                            name="stat2Count"
                            rules={[{ required: true, message: 'Please enter stat 2 count' }]}
                        >
                            <Input placeholder="e.g., 12k+" />
                        </Form.Item>
                        <Form.Item
                            label="Stat 2 Label"
                            name="stat2Label"
                            rules={[{ required: true, message: 'Please enter stat 2 label' }]}
                        >
                            <Input placeholder="e.g., Happy Travelers" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="Stat 3 Count"
                            name="stat3Count"
                            rules={[{ required: true, message: 'Please enter stat 3 count' }]}
                        >
                            <Input placeholder="e.g., 24/7" />
                        </Form.Item>
                        <Form.Item
                            label="Stat 3 Label"
                            name="stat3Label"
                            rules={[{ required: true, message: 'Please enter stat 3 label' }]}
                        >
                            <Input placeholder="e.g., Support" />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Media */}
                <Divider>Media</Divider>
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Background Image URL"
                            name="backgroundImage"
                            rules={[{ required: true, message: 'Please enter background image URL' }]}
                        >
                            <Input placeholder="/hero/hero.jpg" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Video URL"
                            name="videoSrc"
                            rules={[{ required: true, message: 'Please enter video URL' }]}
                        >
                            <Input placeholder="/hero/hero-video.mp4" />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Footer Buttons */}
                <Form.Item className="mb-0 mt-4">
                    <div className="flex justify-end gap-2">
                        <Button onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={isSaving}
                            icon={<SaveOutlined />}
                        >
                            Save Changes
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
}
