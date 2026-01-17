"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Modal, Form, Input, Button, Divider, message, Space } from "antd";
import { SaveOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const { TextArea } = Input;

interface AirlineItem {
    id: number;
    url: string;
    name: string;
}

interface AirLineMarqueeData {
    subtitle: string;
    titlePart1: string;
    titlePart2: string;
    titlePart3: string;
    description: string;
    backgroundText: string;
    airlines: AirlineItem[];
}

const defaultData: AirLineMarqueeData = {
    subtitle: "Global Strategic Alliances",
    titlePart1: "ACCESS",
    titlePart2: "PARTNER",
    titlePart3: "OF",
    description: "Connecting you to over 500+ destinations through our network of world-class airline partners and industry leaders.",
    backgroundText: "GLOBAL",
    airlines: [
        { id: 1, url: "/logo/airline/airlinelogo1.png", name: "Emirates" },
        { id: 2, url: "/logo/airline/airlinelogo2.png", name: "Qatar Airways" },
        { id: 3, url: "/logo/airline/airlinelogo3.png", name: "Turkish Airlines" },
        { id: 4, url: "/logo/airline/airlinelogo4.png", name: "Singapore Airlines" },
        { id: 5, url: "/logo/airline/airlinelogo5.png", name: "Etihad" },
        { id: 6, url: "/logo/airline/airlinelogo6.png", name: "Cathay Pacific" },
        { id: 7, url: "/logo/airline/airlinelogo7.png", name: "Biman Bangladesh" },
        { id: 8, url: "/logo/airline/airlinelogo8.png", name: "US-Bangla" },
        { id: 9, url: "/logo/airline/airlinelogo9.png", name: "Air India" },
        { id: 10, url: "/logo/airline/airlinelogo10.png", name: "Indigo" },
        { id: 11, url: "/logo/airline/airlinelogo11.png", name: "Fly Dubai" },
        { id: 12, url: "/logo/airline/airlinelogo12.png", name: "Saudi Arabian" },
    ]
};

interface AirLineMarqueeEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
}

export default function AirLineMarqueeEditModal({ isOpen, onClose, initialData }: AirLineMarqueeEditModalProps) {
    const router = useRouter();
    const [form] = Form.useForm();
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const mergedData = { ...defaultData, ...initialData };
            form.setFieldsValue(mergedData);
        }
    }, [isOpen, initialData, form]);

    const handleSave = async (values: AirLineMarqueeData) => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/home-page', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ section: 'airline_marquee', data: values }),
            });

            if (response.ok) {
                message.success('Airline marquee updated successfully!');
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
            title="Edit Airline Marquee Section"
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
                {/* Subtitle */}
                <Form.Item
                    label="Subtitle"
                    name="subtitle"
                    rules={[{ required: true, message: 'Please enter subtitle' }]}
                >
                    <Input placeholder="Global Strategic Alliances" />
                </Form.Item>

                {/* Title Parts */}
                <Form.Item label="Title">
                    <Space.Compact style={{ width: '100%' }}>
                        <Form.Item
                            name="titlePart1"
                            noStyle
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <Input placeholder="ACCESS" style={{ width: '33.33%' }} />
                        </Form.Item>
                        <Form.Item
                            name="titlePart2"
                            noStyle
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <Input placeholder="PARTNER (Highlighted)" style={{ width: '33.33%' }} />
                        </Form.Item>
                        <Form.Item
                            name="titlePart3"
                            noStyle
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <Input placeholder="OF" style={{ width: '33.33%' }} />
                        </Form.Item>
                    </Space.Compact>
                </Form.Item>

                {/* Background Text */}
                <Form.Item
                    label="Background Decorative Text"
                    name="backgroundText"
                    rules={[{ required: true, message: 'Please enter background text' }]}
                >
                    <Input placeholder="GLOBAL" />
                </Form.Item>

                {/* Description */}
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please enter description' }]}
                >
                    <TextArea 
                        rows={3} 
                        placeholder="Connecting you to over 500+ destinations..."
                    />
                </Form.Item>

                {/* Airlines */}
                <Divider>Airline Logos</Divider>
                <Form.List name="airlines">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'name']}
                                        rules={[{ required: true, message: 'Missing airline name' }]}
                                    >
                                        <Input placeholder="Airline Name" style={{ width: 200 }} />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'url']}
                                        rules={[{ required: true, message: 'Missing logo URL' }]}
                                    >
                                        <Input placeholder="Logo URL" style={{ width: 400 }} />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'id']}
                                        hidden
                                    >
                                        <Input type="hidden" />
                                    </Form.Item>
                                    <Button 
                                        type="text" 
                                        danger 
                                        icon={<DeleteOutlined />} 
                                        onClick={() => remove(name)}
                                    />
                                </Space>
                            ))}
                            <Form.Item>
                                <Button 
                                    type="dashed" 
                                    onClick={() => add({ id: Date.now(), name: '', url: '' })} 
                                    block 
                                    icon={<PlusOutlined />}
                                >
                                    Add Airline
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

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
