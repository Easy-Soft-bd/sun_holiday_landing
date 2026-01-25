"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Modal, Form, Input, Button, Divider, Row, Col, Space, message, Upload, Select } from "antd";
import { SaveOutlined, PlusOutlined, DeleteOutlined, UploadOutlined, LinkOutlined } from "@ant-design/icons";
import * as LucideIcons from "lucide-react";

const { TextArea } = Input;

interface SocialLink {
    icon: string;
    url: string;
}

interface QuickLink {
    label: string;
    url: string;
}

interface Certification {
    name: string;
    image: string;
}

interface FooterData {
    bio: string;
    socialLinks: SocialLink[];
    servicesTitle: string;
    servicesLinks: QuickLink[];
    contactTitle: string;
    contactAddress: string;
    contactPhone: string;
    contactEmail: string;
    newsletterTitle: string;
    newsletterDescription: string;
    certificationsTitle: string;
    certifications: Certification[];
    paymentsTitle: string;
    copyrightText: string;
}

const defaultData: FooterData = {
    bio: "Sun Holidays Ltd is your premier gateway to world-class travel experiences. We specialize in curated holidays, seamless visa processing, and luxury resort bookings.",
    socialLinks: [
        { icon: "Facebook", url: "#" },
        { icon: "Instagram", url: "#" },
        { icon: "Twitter", url: "#" },
        { icon: "Linkedin", url: "#" },
    ],
    servicesTitle: "Services",
    servicesLinks: [
        { label: "Visa Processing", url: "/visa" },
        { label: "Air Ticketing", url: "/tickets" },
        { label: "Resort Bookings", url: "/resorts" },
        { label: "Custom Tour Packages", url: "/tours" },
        { label: "News & Blog", url: "/blog" },
    ],
    contactTitle: "Get In Touch",
    contactAddress: "123 Travel Plaza, Suite 456\nDhaka, Bangladesh",
    contactPhone: "+880 1234 567 890",
    contactEmail: "support@sunholidays.com",
    newsletterTitle: "Newsletter",
    newsletterDescription: "Subscribe for exclusive travel deals and updates.",
    certificationsTitle: "Authorized By & Certified Member",
    certifications: [
        { name: "IATA", image: "/certs/iata.png" },
        { name: "ATAB", image: "/certs/atab.png" },
        { name: "Civil Aviation", image: "/certs/civil-aviation.png" },
        { name: "ISO", image: "/certs/iso.png" },
    ],
    paymentsTitle: "Secure Payments",
    copyrightText: "Sun Holidays Ltd. All Rights Reserved.",
};

const SOCIAL_PLATFORMS = [
    { label: "Facebook", value: "Facebook" },
    { label: "Instagram", value: "Instagram" },
    { label: "Twitter / X", value: "Twitter" },
    { label: "LinkedIn", value: "Linkedin" },
    { label: "YouTube", value: "Youtube" },
    { label: "WhatsApp", value: "Phone" },
    { label: "Mail", value: "Mail" },
];

interface FooterEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
}

export default function FooterEditModal({ isOpen, onClose, initialData }: FooterEditModalProps) {
    const router = useRouter();
    const [form] = Form.useForm();
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const mergedCertifications = (initialData?.certifications || defaultData.certifications).map((cert: any, i: number) => {
                const defaultCert = defaultData.certifications[i] || defaultData.certifications[0];
                return {
                    ...defaultCert,
                    ...cert,
                    image: cert.image || defaultCert.image
                };
            });

            const mergedData = { 
                ...defaultData, 
                ...initialData,
                certifications: mergedCertifications
            };
            form.setFieldsValue(mergedData);
        }
    }, [isOpen, initialData, form]);

    const handleSave = async (values: FooterData) => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/home-page', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ section: 'footer', data: values }),
            });

            if (response.ok) {
                message.success('Footer updated successfully!');
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
            title="Edit Footer Content"
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
                    {/* Left Column */}
                    <Col span={12}>
                        <Divider titlePlacement="left">Brand & Social</Divider>
                        <Form.Item label="Bio Text" name="bio" rules={[{ required: true }]}>
                            <TextArea rows={3} />
                        </Form.Item>
                        
                        <Form.List name="socialLinks">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <div key={key} className="mb-4 p-3 border border-base-300 rounded-lg bg-base-100/50">
                                            <Row gutter={12} align="middle">
                                                <Col span={8}>
                                                    <Form.Item {...restField} name={[name, 'icon']} label="Platform" rules={[{ required: true, message: 'Platform' }]}>
                                                        <Select options={SOCIAL_PLATFORMS} placeholder="Select Platform" />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={14}>
                                                    <Form.Item {...restField} name={[name, 'url']} label="Profile URL" rules={[{ required: true, message: 'URL' }]}>
                                                        <Input placeholder="https://facebook.com/yourpage" />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={2}>
                                                    <div className="pt-2">
                                                        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <SocialIconPreview form={form} fieldName={name} />
                                        </div>
                                    ))}
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Add Social Link</Button>
                                </>
                            )}
                        </Form.List>

                        <Divider titlePlacement="left">Quick Links (Services)</Divider>
                        <Form.Item label="Services Title" name="servicesTitle" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.List name="servicesLinks">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                            <Form.Item {...restField} name={[name, 'label']} rules={[{ required: true, message: 'Label' }]}>
                                                <Input placeholder="Visa" style={{ width: 120 }} />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, 'url']} rules={[{ required: true, message: 'Path/URL' }]}>
                                                <Input placeholder="/visa" style={{ width: 220 }} />
                                            </Form.Item>
                                            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                                        </Space>
                                    ))}
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Add Service Link</Button>
                                </>
                            )}
                        </Form.List>
                    </Col>

                    {/* Right Column */}
                    <Col span={12}>
                        <Divider titlePlacement="left">Contact Information</Divider>
                        <Form.Item label="Contact Title" name="contactTitle" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Address" name="contactAddress" rules={[{ required: true }]}>
                            <TextArea rows={2} />
                        </Form.Item>
                        <Form.Item label="Phone" name="contactPhone" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Email" name="contactEmail" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>

                        <Divider titlePlacement="left">Newsletter</Divider>
                        <Form.Item label="Newsletter Title" name="newsletterTitle" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Newsletter Description" name="newsletterDescription" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>

                        <Divider titlePlacement="left">Certifications</Divider>
                        <Form.Item label="Certifications Title" name="certificationsTitle" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.List name="certifications">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <div key={key} className="mb-4 p-3 border border-base-300 rounded-lg">
                                            <Space align="baseline">
                                                <Form.Item {...restField} name={[name, 'name']} rules={[{ required: true }]}>
                                                    <Input placeholder="Logo Name" />
                                                </Form.Item>
                                                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                                            </Space>
                                            <CertificationImageItem form={form} fieldName={name} setIsSaving={setIsSaving} restField={restField} />
                                        </div>
                                    ))}
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Add Certification Logo</Button>
                                </>
                            )}
                        </Form.List>
                    </Col>
                </Row>

                <Divider />
                <Form.Item label="Copyright Text" name="copyrightText" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

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

function SocialIconPreview({ form, fieldName }: { form: any, fieldName: number }) {
    const iconName = Form.useWatch(['socialLinks', fieldName, 'icon'], form);
    
    // Dynamically import icons for preview in modal
    // Note: In a real app we'd want a more robust icon mapper
    return (
        <div className="flex items-center gap-2 mt-[-8px] mb-2 px-1">
            <span className="text-xs text-base-content/40 font-medium uppercase tracking-wider">Icon Preview:</span>
            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                {iconName === "Facebook" && <LucideIcons.Facebook size={16} />}
                {iconName === "Instagram" && <LucideIcons.Instagram size={16} />}
                {iconName === "Twitter" && <LucideIcons.Twitter size={16} />}
                {iconName === "Linkedin" && <LucideIcons.Linkedin size={16} />}
                {iconName === "Youtube" && <LucideIcons.Youtube size={16} />}
                {iconName === "Phone" && <LucideIcons.Phone size={16} />}
                {iconName === "Mail" && <LucideIcons.Mail size={16} />}
                {!["Facebook", "Instagram", "Twitter", "Linkedin", "Youtube", "Phone", "Mail"].includes(iconName) && <LinkOutlined />}
            </div>
            <span className="text-xs font-bold text-primary">{iconName || "None"}</span>
        </div>
    );
}

function CertificationImageItem({ form, fieldName, setIsSaving, restField }: { form: any, fieldName: number, setIsSaving: (s: boolean) => void, restField?: any }) {
    const imageUrl = Form.useWatch(['certifications', fieldName, 'image'], form);

    return (
        <Form.Item label="Logo Image">
            <div className="flex flex-col gap-2">
                <Space.Compact style={{ width: '100%' }}>
                    <Form.Item {...restField} name={[fieldName, 'image']} noStyle rules={[{ required: true }]}>
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
                            const newCertifications = [...form.getFieldValue('certifications')];
                            newCertifications[fieldName].image = info.file.response.url;
                            form.setFieldsValue({ certifications: newCertifications });
                            message.success(`${info.file.name} uploaded successfully`);
                            setIsSaving(false);
                        } else if (info.file.status === 'error') {
                            message.error(`${info.file.name} upload failed.`);
                            setIsSaving(false);
                        }
                    }}
                >
                    <Button icon={<UploadOutlined />} size="small">Upload Logo</Button>
                </Upload>
                {imageUrl && (
                    <div className="relative w-full h-12 rounded bg-white flex items-center justify-center border border-base-300">
                        <img src={imageUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
                    </div>
                )}
            </div>
        </Form.Item>
    );
}
