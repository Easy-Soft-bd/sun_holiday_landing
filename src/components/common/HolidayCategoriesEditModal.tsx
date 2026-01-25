"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Modal, Form, Input, Button, Divider, Row, Col, Space, message, Select, Upload } from "antd";
import { SaveOutlined, PlusOutlined, DeleteOutlined, UploadOutlined, LinkOutlined } from "@ant-design/icons";

const { TextArea } = Input;

interface CategoryItem {
    id: string; // Internal ID for management
    title: string;
    description: string;
    image: string;
    className: string;
    icon: string;
    count: string;
    link: string;
}

interface HolidayCategoriesData {
    headerTitlePart1: string;
    headerTitlePart2: string;
    headerDescription: string;
    headerButtonText: string;
    headerButtonLink: string;
    categories: CategoryItem[];
}

const defaultData: HolidayCategoriesData = {
    headerTitlePart1: "Pick Your",
    headerTitlePart2: "Paradise",
    headerDescription: "Tailored holiday experiences designed for the modern traveler. Where do you want to go next?",
    headerButtonText: "View All Destinations",
    headerButtonLink: "/destinations",
    categories: [
        {
            id: "1",
            title: "Beach Escape",
            description: "Turquoise waters & white sands.",
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800",
            className: "md:col-span-2 md:row-span-2",
            icon: "Umbrella",
            count: "120+ Locations",
            link: "/category/beach",
        },
        {
            id: "2",
            title: "Mountain Trek",
            description: "Reach new heights.",
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800",
            className: "md:col-span-2 md:row-span-1",
            icon: "Mountain",
            count: "85 Locations",
            link: "/category/mountain",
        },
        {
            id: "3",
            title: "City Lights",
            description: "Metropolitan wonders.",
            image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=800",
            className: "md:col-span-1 md:row-span-1",
            icon: "Building2",
            count: "40+ Cities",
            link: "/category/city",
        },
        {
            id: "4",
            title: "Exotic Jungles",
            description: "Nature's hidden gems.",
            image: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6?q=80&w=800",
            className: "md:col-span-1 md:row-span-1",
            icon: "Palmtree",
            count: "25+ Resorts",
            link: "/category/jungle",
        },
    ],
};

const LUCIDE_ICONS = ["Umbrella", "Mountain", "Building2", "Palmtree", "Waves", "Dumbbell", "Utensils", "Users", "Coffee", "Hotel", "MapPin", "ChevronRight", "Star", "Wifi", "Plane", "ShieldCheck"];

const BENTO_CLASSES = [
    { label: "Large Featured (2x2)", value: "md:col-span-2 md:row-span-2" },
    { label: "Wide (2x1)", value: "md:col-span-2 md:row-span-1" },
    { label: "Tall (1x2)", value: "md:col-span-1 md:row-span-2" },
    { label: "Small (1x1)", value: "md:col-span-1 md:row-span-1" },
];

interface HolidayCategoriesEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
}

export default function HolidayCategoriesEditModal({ isOpen, onClose, initialData }: HolidayCategoriesEditModalProps) {
    const router = useRouter();
    const [form] = Form.useForm();
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const mergedData = { ...defaultData, ...initialData };
            form.setFieldsValue(mergedData);
        }
    }, [isOpen, initialData, form]);

    const handleSave = async (values: HolidayCategoriesData) => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/home-page', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ section: 'holiday_categories', data: values }),
            });

            if (response.ok) {
                message.success('Holiday categories updated successfully!');
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
            title="Edit Holiday Categories Section"
            open={isOpen}
            onCancel={handleCancel}
            width={1200}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
                initialValues={defaultData}
            >
                <Divider titlePlacement="left">Header Section</Divider>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Title Part 1" name="headerTitlePart1" rules={[{ required: true }]}>
                            <Input placeholder="Pick Your" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Title Part 2 (Highlighted)" name="headerTitlePart2" rules={[{ required: true }]}>
                            <Input placeholder="Paradise" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Button Text" name="headerButtonText" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={16}>
                        <Form.Item label="Description" name="headerDescription" rules={[{ required: true }]}>
                            <TextArea rows={2} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Button Link" name="headerButtonLink" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider titlePlacement="left">Categories (Bento Grid)</Divider>
                <Form.List name="categories">
                    {(fields, { add, remove }) => (
                        <>
                            <Row gutter={[16, 16]}>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Col span={12} key={key}>
                                        <div className="p-4 border border-base-300 rounded-xl bg-base-200/50">
                                            <div className="flex justify-between mb-4">
                                                <span className="font-bold text-base-content/60">Category Item #{key + 1}</span>
                                                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                                            </div>
                                            
                                            <Row gutter={12}>
                                                <Col span={12}>
                                                    <Form.Item {...restField} name={[name, 'title']} label="Title" rules={[{ required: true }]}>
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item {...restField} name={[name, 'count']} label="Count Badge" rules={[{ required: true }]}>
                                                        <Input placeholder="120+ Locations" />
                                                    </Form.Item>
                                                </Col>
                                            </Row>

                                            <Row gutter={12}>
                                                <Col span={12}>
                                                    <Form.Item {...restField} name={[name, 'description']} label="Description" rules={[{ required: true }]}>
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item {...restField} name={[name, 'link']} label="Navigation Link" rules={[{ required: true }]}>
                                                        <Input placeholder="/category/beach" />
                                                    </Form.Item>
                                                </Col>
                                            </Row>

                                            <Row gutter={12}>
                                                <Col span={12}>
                                                    <Form.Item {...restField} name={[name, 'icon']} label="Icon" rules={[{ required: true }]}>
                                                        <Select>
                                                            {LUCIDE_ICONS.map(icon => <Select.Option key={icon} value={icon}>{icon}</Select.Option>)}
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item {...restField} name={[name, 'className']} label="Grid Layout" rules={[{ required: true }]}>
                                                        <Select options={BENTO_CLASSES} />
                                                    </Form.Item>
                                                </Col>
                                            </Row>

                                            {/* Image Upload for Category */}
                                            <CategoryImageUpload form={form} fieldName={name} setIsSaving={setIsSaving} />
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                            <Button type="dashed" onClick={() => add({ id: Date.now().toString(), className: 'md:col-span-1 md:row-span-1', icon: 'Umbrella', link: '#' })} block icon={<PlusOutlined />} className="mt-4">
                                Add Category
                            </Button>
                        </>
                    )}
                </Form.List>

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

// Sub-component for category image upload to handle `useWatch` specifically for each field
function CategoryImageUpload({ form, fieldName, setIsSaving }: { form: any, fieldName: number, setIsSaving: (s: boolean) => void }) {
    const imageUrl = Form.useWatch(['categories', fieldName, 'image'], form);

    return (
        <Form.Item label="Image" extra="Recommended: 800x800px">
            <div className="flex flex-col gap-2">
                <Space.Compact style={{ width: '100%' }}>
                    <Form.Item name={[fieldName, 'image']} noStyle rules={[{ required: true }]}>
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
                            const newCategories = [...form.getFieldValue('categories')];
                            newCategories[fieldName].image = info.file.response.url;
                            form.setFieldsValue({ categories: newCategories });
                            message.success(`${info.file.name} uploaded successfully`);
                            setIsSaving(false);
                        } else if (info.file.status === 'error') {
                            message.error(`${info.file.name} upload failed.`);
                            setIsSaving(false);
                        }
                    }}
                >
                    <Button icon={<UploadOutlined />} size="small">Upload Image</Button>
                </Upload>
                {imageUrl && (
                    <div className="relative w-full h-20 rounded-lg overflow-hidden border border-base-300">
                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                )}
            </div>
        </Form.Item>
    );
}
