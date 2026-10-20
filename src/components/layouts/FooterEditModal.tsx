"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Modal, Form, Input, Button, Divider, Row, Col, Space, App, Upload, Alert } from "antd";
import { SaveOutlined, PlusOutlined, DeleteOutlined, UploadOutlined, LinkOutlined } from "@ant-design/icons";
import IconPicker from "@/src/components/common/IconPicker";
import { DEFAULT_SOCIAL_ICON, SUGGESTED_SOCIAL_LINKS, sanitizeSocialUrl } from "@/src/lib/social-links";

const { TextArea } = Input;

interface QuickLink {
    label: string;
    url: string;
}

interface SocialLinkField {
    label: string;
    icon: string;
    url: string;
}

interface Certification {
    name: string;
    image: string;
}

interface FooterData {
    bio: string;
    socialLinks: SocialLinkField[];
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

const EMPTY_SOCIAL_LINKS: SocialLinkField[] = [
    { label: "Facebook", icon: "SiFacebook", url: "" },
    { label: "Instagram", icon: "SiInstagram", url: "" },
    { label: "YouTube", icon: "SiYoutube", url: "" },
    { label: "WhatsApp", icon: "SiWhatsapp", url: "" },
];

const defaultData: FooterData = {
    bio: "Sun Tourism Ltd is your premier gateway to world-class travel experiences. We specialize in curated holidays, seamless visa processing, and luxury resort bookings.",
    socialLinks: EMPTY_SOCIAL_LINKS,
    servicesTitle: "Services",
    servicesLinks: [
        { label: "Visa Processing", url: "/visa" },
        { label: "Ticket", url: "/tickets" },
        { label: "Tour", url: "/tours" },
        { label: "News & Blog", url: "/blog" },
    ],
    resortsTitle: "Resorts",
    resortsLinks: [
        { label: "Sailor Moon Beach Resort", url: "/sailor-moon-resorts" },
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

            const storedSocial = Array.isArray(initialData?.socialLinks)
                ? initialData.socialLinks.filter((link: SocialLinkField) => String(link?.url || "").trim())
                : [];

            const mergedData: FooterData = {
                ...defaultData,
                ...initialData,
                socialLinks: storedSocial.length > 0 ? storedSocial : EMPTY_SOCIAL_LINKS,
                servicesLinks:
                    Array.isArray(initialData?.servicesLinks) && initialData.servicesLinks.length > 0
                        ? initialData.servicesLinks
                        : defaultData.servicesLinks,
                resortsLinks:
                    Array.isArray(initialData?.resortsLinks) && initialData.resortsLinks.length > 0
                        ? initialData.resortsLinks
                        : defaultData.resortsLinks,
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
        const socialLinks = (values.socialLinks || [])
            .map((link) => ({
                label: String(link?.label || "").trim(),
                icon: String(link?.icon || "").trim() || DEFAULT_SOCIAL_ICON,
                url: sanitizeSocialUrl(link?.url),
            }))
            .filter((link) => link.url.length > 0 && link.label.length > 0);

        try {
            const response = await fetch('/api/home-page', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    section: 'footer',
                    data: { ...initialData, ...values, socialLinks },
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

                <Divider titlePlacement="left">Social media</Divider>
                <Alert
                    type="info"
                    showIcon
                    className="mb-4"
                    title="These profile links appear under the logo."
                    description="Use full profile URLs such as https://facebook.com/yourpage. Blank rows are skipped. The same links are added to the site’s TravelAgency details for search engines."
                />
                <Form.List name="socialLinks">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <div key={key} className="mb-3 grid grid-cols-1 items-start gap-2 sm:grid-cols-[180px_160px_minmax(0,1fr)_auto]">
                                    <Form.Item {...restField} name={[name, "icon"]} className="mb-0">
                                        <IconPicker placeholder="Icon" />
                                    </Form.Item>
                                    <Form.Item {...restField} name={[name, "label"]} className="mb-0">
                                        <Input placeholder="Facebook" />
                                    </Form.Item>
                                    <Form.Item {...restField} name={[name, "url"]} className="mb-0">
                                        <Input placeholder="https://facebook.com/yourpage" />
                                    </Form.Item>
                                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} aria-label="Remove social link" />
                                </div>
                            ))}
                            <Button
                                type="dashed"
                                onClick={() => add({ label: "", icon: DEFAULT_SOCIAL_ICON, url: "" })}
                                block
                                icon={<PlusOutlined />}
                            >
                                Add social link
                            </Button>
                            <div className="mt-3">
                                {SUGGESTED_SOCIAL_LINKS.map((preset) => (
                                    <Button
                                        key={preset.label}
                                        size="small"
                                        className="mr-2 mb-2"
                                        onClick={() => add({ ...preset })}
                                    >
                                        {preset.label}
                                    </Button>
                                ))}
                            </div>
                        </>
                    )}
                </Form.List>

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
                            title="Phone, email, address, and the map come from Settings."
                            description="Edit those from Admin Dashboard, then Settings. Social profiles are edited in this form."
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
