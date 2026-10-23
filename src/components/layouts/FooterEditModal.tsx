"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Modal, Form, Input, Button, Divider, Row, Col, Space, App, Upload, Alert } from "antd";
import { SaveOutlined, PlusOutlined, DeleteOutlined, UploadOutlined, LinkOutlined } from "@ant-design/icons";
import { ensureSwapnoBilashResortLink } from "@/src/lib/resort-links";
import { ensureEducationLink, ensureMedicalVisaLink } from "@/src/lib/service-links";

const { TextArea } = Input;

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
    servicesTitle: string;
    servicesLinks: QuickLink[];
    resortsTitle: string;
    resortsLinks: QuickLink[];
    mediaTitle: string;
    mediaLinks: QuickLink[];
    contactTitle: string;
    certificationsTitle: string;
    certifications: Certification[];
    paymentsTitle: string;
    copyrightText: string;
}

const defaultData: FooterData = {
    bio: "Sun Tourism Ltd is your premier gateway to world-class travel experiences. We specialize in curated holidays, seamless visa processing, and luxury resort bookings.",
    servicesTitle: "Services",
    servicesLinks: [
        { label: "Visa Processing", url: "/visa" },
        { label: "Medical Visa", url: "/medical-visa" },
        { label: "Sun Global Education", url: "/sun-global-education" },
        { label: "Ticket", url: "/tickets" },
        { label: "Tour", url: "/tours" },
        { label: "News & Blog", url: "/blog" },
    ],
    resortsTitle: "Resorts",
    resortsLinks: [
        { label: "Sailor Moon Beach Resort", url: "/sailor-moon-resorts" },
        { label: "Swapno Bilash Resort", url: "/swapno-bilash-resort" },
        { label: "Sunvia Hotel Resort", url: "/sunvia-hotel-resort" },
        { label: "Grandeur Bliss", url: "/resort/grandeur-bliss" },
    ],
    mediaTitle: "Media",
    mediaLinks: [
        { label: "News", url: "/news" },
        { label: "Event", url: "/events" },
        { label: "Blog", url: "/blog" },
        { label: "CSR", url: "/csr" },
    ],
    contactTitle: "Get In Touch",
    certificationsTitle: "Authorized By & Certified Member",
    certifications: [
        { name: "IATA", image: "/certs/iata.png" },
        { name: "ATAB", image: "/certs/atab.png" },
        { name: "Civil Aviation", image: "/certs/civil-aviation.png" },
        { name: "ISO", image: "/certs/iso.png" },
    ],
    paymentsTitle: "Secure Payments",
    copyrightText: "Sun Tourism Ltd. All Rights Reserved.",
};

interface FooterEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
}

export default function FooterEditModal({ isOpen, onClose, initialData }: FooterEditModalProps) {
    const { message } = App.useApp();
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

            const mergedData: FooterData = {
                ...defaultData,
                ...initialData,
                servicesLinks: ensureEducationLink(
                    ensureMedicalVisaLink(
                        Array.isArray(initialData?.servicesLinks) && initialData.servicesLinks.length > 0
                            ? initialData.servicesLinks
                            : defaultData.servicesLinks,
                    ),
                ),
                resortsLinks: ensureSwapnoBilashResortLink(
                    Array.isArray(initialData?.resortsLinks) && initialData.resortsLinks.length > 0
                        ? initialData.resortsLinks
                        : defaultData.resortsLinks,
                ),
                resortsTitle: initialData?.resortsTitle || defaultData.resortsTitle,
                mediaLinks:
                    Array.isArray(initialData?.mediaLinks) && initialData.mediaLinks.length > 0
                        ? initialData.mediaLinks
                        : defaultData.mediaLinks,
                mediaTitle: initialData?.mediaTitle || defaultData.mediaTitle,
                certifications: mergedCertifications,
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
                body: JSON.stringify({
                    section: 'footer',
                    data: {
                        ...initialData,
                        ...values,
                        socialLinks: initialData?.socialLinks,
                    },
                }),
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
                <Divider titlePlacement="left">Brand</Divider>
                <Form.Item label="Bio Text" name="bio" rules={[{ required: true }]}>
                    <TextArea rows={3} />
                </Form.Item>

                <Alert
                    type="info"
                    showIcon
                    className="mb-4"
                    title="Phone, email, address, map, and social profiles come from Settings."
                    description="Edit those from Dashboard, then Settings. This form keeps the footer link columns."
                />

                <Row gutter={24} className="mt-2">
                    <Col xs={24} lg={12}>
                        <Divider titlePlacement="left">Services</Divider>
                        <Form.Item label="Services Title" name="servicesTitle" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.List name="servicesLinks">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <div key={key} className="mb-2 grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] items-start gap-2">
                                            <Form.Item {...restField} name={[name, "label"]} className="mb-0" rules={[{ required: true, message: "Label" }]}>
                                                <Input placeholder="Visa" />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, "url"]} className="mb-0" rules={[{ required: true, message: "Path" }]}>
                                                <Input placeholder="/visa" />
                                            </Form.Item>
                                            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} aria-label="Remove service link" />
                                        </div>
                                    ))}
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Add Service Link</Button>
                                </>
                            )}
                        </Form.List>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Divider titlePlacement="left">Resorts</Divider>
                        <Form.Item label="Resorts Title" name="resortsTitle" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.List name="resortsLinks">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <div key={key} className="mb-2 grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] items-start gap-2">
                                            <Form.Item {...restField} name={[name, "label"]} className="mb-0" rules={[{ required: true, message: "Label" }]}>
                                                <Input placeholder="Resort" />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, "url"]} className="mb-0" rules={[{ required: true, message: "Path" }]}>
                                                <Input placeholder="/sunvia-hotel-resort" />
                                            </Form.Item>
                                            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} aria-label="Remove resort link" />
                                        </div>
                                    ))}
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Add Resort Link</Button>
                                </>
                            )}
                        </Form.List>
                    </Col>
                </Row>

                <Divider titlePlacement="left">Media</Divider>
                <Form.Item label="Media Title" name="mediaTitle" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.List name="mediaLinks">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <div key={key} className="mb-2 grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] items-start gap-2">
                                    <Form.Item {...restField} name={[name, "label"]} className="mb-0" rules={[{ required: true, message: "Label" }]}>
                                        <Input placeholder="News" />
                                    </Form.Item>
                                    <Form.Item {...restField} name={[name, "url"]} className="mb-0" rules={[{ required: true, message: "Path" }]}>
                                        <Input placeholder="/news" />
                                    </Form.Item>
                                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} aria-label="Remove media link" />
                                </div>
                            ))}
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Add Media Link</Button>
                        </>
                    )}
                </Form.List>

                <Row gutter={24}>
                    <Col xs={24} lg={12}>
                        <Divider titlePlacement="left">Contact</Divider>
                        <Form.Item label="Contact Title" name="contactTitle" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Alert
                            type="info"
                            showIcon
                            title="The contact details shown here come from Settings."
                            description="Edit phone, email, address, and the office map from Dashboard, then Settings."
                        />
                    </Col>
                    <Col xs={24} lg={12}>
                        <Divider titlePlacement="left">Payments and copyright</Divider>
                        <Form.Item label="Payments Title" name="paymentsTitle" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Copyright Text" name="copyrightText" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider titlePlacement="left">Certifications</Divider>
                <Form.Item label="Certifications Title" name="certificationsTitle" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.List name="certifications">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <div key={key} className="mb-4 rounded-lg border border-base-300 p-3">
                                    <Space align="baseline">
                                        <Form.Item {...restField} name={[name, "name"]} rules={[{ required: true }]}>
                                            <Input placeholder="Logo Name" />
                                        </Form.Item>
                                        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} aria-label="Remove certification" />
                                    </Space>
                                    <CertificationImageItem form={form} fieldName={name} setIsSaving={setIsSaving} restField={restField} />
                                </div>
                            ))}
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Add Certification Logo</Button>
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

function CertificationImageItem({ form, fieldName, setIsSaving, restField }: { form: any, fieldName: number, setIsSaving: (s: boolean) => void, restField?: any }) {
    const { message } = App.useApp();
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
