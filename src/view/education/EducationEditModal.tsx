"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { App, Button, Col, Form, Input, Modal, Row, Space, Tabs } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import ImageUrlUploadField from "@/src/components/common/ImageUrlUploadField";
import IconPicker from "@/src/components/common/IconPicker";
import {
  mergeEducationPageData,
  type EducationDestination,
  type EducationDocument,
  type EducationPageData,
  type EducationService,
  type EducationStep,
} from "./education-page-data";

const { TextArea } = Input;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<EducationPageData>;
};

type TabKey = "seo" | "hero" | "services" | "destinations" | "documents" | "steps" | "visit" | "enquiry";

const TAB_BY_FIELD: Record<string, TabKey> = {
  metaTitle: "seo",
  metaDescription: "seo",
  metaKeywords: "seo",
  heroBadge: "hero",
  heroTitleMain: "hero",
  heroTitleAccent: "hero",
  heroSubtitle: "hero",
  heroDescription: "hero",
  heroImage: "hero",
  heroEnquireLabel: "hero",
  heroVisitLabel: "hero",
  servicesEyebrow: "services",
  servicesTitle: "services",
  servicesIntro: "services",
  services: "services",
  destinationsEyebrow: "destinations",
  destinationsTitle: "destinations",
  destinationsIntro: "destinations",
  destinations: "destinations",
  documentsEyebrow: "documents",
  documentsTitle: "documents",
  documentsIntro: "documents",
  documentsImage: "documents",
  documents: "documents",
  stepsEyebrow: "steps",
  stepsTitle: "steps",
  stepsIntro: "steps",
  steps: "steps",
  visitEyebrow: "visit",
  visitTitle: "visit",
  visitBody: "visit",
  visitCallLabel: "visit",
  visitOfficeLabel: "visit",
  inquiryEyebrow: "enquiry",
  inquiryTitle: "enquiry",
  inquiryIntro: "enquiry",
  inquiryButton: "enquiry",
};

function TabIntro({ children }: { children: string }) {
  return <p className="mb-3 text-sm text-slate-500">{children}</p>;
}

export default function EducationEditModal({ isOpen, onClose, initialData }: Props) {
  const { message } = App.useApp();
  const [form] = Form.useForm<EducationPageData>();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("hero");
  const [counts, setCounts] = useState({ services: 0, destinations: 0, documents: 0, steps: 0 });
  const router = useRouter();

  const syncCounts = () => {
    const values = form.getFieldsValue(true) as Partial<EducationPageData>;
    setCounts({
      services: Array.isArray(values.services) ? values.services.filter((item) => item?.title?.trim()).length : 0,
      destinations: Array.isArray(values.destinations) ? values.destinations.filter((item) => item?.title?.trim()).length : 0,
      documents: Array.isArray(values.documents) ? values.documents.filter((item) => item?.text?.trim()).length : 0,
      steps: Array.isArray(values.steps) ? values.steps.filter((item) => item?.title?.trim()).length : 0,
    });
  };

  useEffect(() => {
    if (!isOpen) return;
    const merged = mergeEducationPageData(initialData);
    form.setFieldsValue(merged);
    setCounts({
      services: merged.services.length,
      destinations: merged.destinations.length,
      documents: merged.documents.length,
      steps: merged.steps.length,
    });
    setActiveTab("hero");
  }, [isOpen, initialData, form]);

  const onFinish = async (values: EducationPageData) => {
    setSaving(true);
    try {
      const stored = form.getFieldsValue(true) as EducationPageData;
      const payload = mergeEducationPageData({
        ...stored,
        ...values,
        services: values.services ?? stored.services,
        destinations: values.destinations ?? stored.destinations,
        documents: values.documents ?? stored.documents,
        steps: values.steps ?? stored.steps,
      });
      const res = await fetch("/api/home-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "education_page", data: payload }),
      });
      if (!res.ok) {
        message.error("Failed to save Sun Global Education");
        return;
      }
      message.success("Sun Global Education updated");
      router.refresh();
      onClose();
    } catch {
      message.error("Failed to save Sun Global Education");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      width={880}
      centered
      destroyOnHidden={false}
      title="Edit Sun Global Education"
      styles={{ body: { paddingTop: 4, overflow: "visible" } }}
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="m-0 text-left text-sm text-slate-500">Save updates the whole page, including the other tabs.</p>
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" loading={saving} icon={<SaveOutlined />} onClick={() => form.submit()}>
              Save page
            </Button>
          </Space>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
        className="[&_.ant-form-item]:mb-3"
        onValuesChange={() => syncCounts()}
        onFinish={(values) => void onFinish(values)}
        onFinishFailed={({ errorFields }) => {
          const field = String(errorFields[0]?.name?.[0] ?? "");
          setActiveTab(TAB_BY_FIELD[field] ?? "hero");
          message.warning("Check the highlighted fields before saving.");
        }}
      >
        <Tabs
          activeKey={activeTab}
          destroyOnHidden={false}
          onChange={(key) => {
            setActiveTab(key as TabKey);
            syncCounts();
          }}
          tabBarStyle={{ marginBottom: 8 }}
          items={[
            {
              key: "seo",
              forceRender: true,
              label: "SEO",
              children: (
                <>
                  <TabIntro>The title, description, and keywords used in search results and link previews.</TabIntro>
                  <Form.Item name="metaTitle" label="Search title" rules={[{ required: true, message: "Enter the search title" }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="metaDescription" label="Search description" rules={[{ required: true, message: "Enter the description" }]}>
                    <TextArea rows={3} />
                  </Form.Item>
                  <Form.Item name="metaKeywords" label="Keywords" extra="Separate keywords with commas.">
                    <TextArea rows={2} />
                  </Form.Item>
                </>
              ),
            },
            {
              key: "hero",
              forceRender: true,
              label: "Hero",
              children: (
                <>
                  <TabIntro>The banner at the top. The accent word is colored. The buttons jump to the form and the office block.</TabIntro>
                  <Form.Item name="heroBadge" label="Small label" rules={[{ required: true, message: "Enter the small label" }]}>
                    <Input />
                  </Form.Item>
                  <Row gutter={12}>
                    <Col span={12}>
                      <Form.Item name="heroTitleMain" label="Heading" rules={[{ required: true, message: "Enter the heading" }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="heroTitleAccent" label="Colored word" rules={[{ required: true, message: "Enter the colored word" }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item name="heroSubtitle" label="Subtitle">
                    <Input />
                  </Form.Item>
                  <Form.Item name="heroDescription" label="Intro">
                    <TextArea rows={3} />
                  </Form.Item>
                  <Row gutter={12}>
                    <Col span={12}>
                      <Form.Item name="heroEnquireLabel" label="Enquiry button">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="heroVisitLabel" label="Visit button">
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item name="heroImage" label="Background photo">
                    <ImageUrlUploadField uploadType="visa" />
                  </Form.Item>
                </>
              ),
            },
            {
              key: "services",
              forceRender: true,
              label: `Services (${counts.services})`,
              children: (
                <>
                  <TabIntro>The cards that explain the consultancy. The last word of the heading is colored.</TabIntro>
                  <Form.Item name="servicesEyebrow" label="Small label">
                    <Input />
                  </Form.Item>
                  <Form.Item name="servicesTitle" label="Heading">
                    <Input />
                  </Form.Item>
                  <Form.Item name="servicesIntro" label="Intro">
                    <TextArea rows={2} />
                  </Form.Item>
                  <Form.List name="services">
                    {(fields, { add, remove, move }) => (
                      <div className="grid gap-3">
                        {fields.map((field, index) => (
                          <div key={field.key} className="rounded-xl border border-slate-200 p-3">
                            <Row gutter={12}>
                              <Col xs={24} md={8}>
                                <Form.Item name={[field.name, "icon"]} label="Icon">
                                  <IconPicker />
                                </Form.Item>
                              </Col>
                              <Col xs={24} md={16}>
                                <Form.Item name={[field.name, "title"]} label="Title" rules={[{ required: true, message: "Enter a title" }]}>
                                  <Input />
                                </Form.Item>
                              </Col>
                            </Row>
                            <Form.Item name={[field.name, "description"]} label="Description">
                              <TextArea rows={2} />
                            </Form.Item>
                            <Space>
                              <Button size="small" icon={<ArrowUpOutlined />} disabled={index === 0} onClick={() => move(index, index - 1)}>Up</Button>
                              <Button size="small" icon={<ArrowDownOutlined />} disabled={index === fields.length - 1} onClick={() => move(index, index + 1)}>Down</Button>
                              <Button size="small" danger icon={<DeleteOutlined />} onClick={() => remove(field.name)}>Remove</Button>
                            </Space>
                          </div>
                        ))}
                        <Button icon={<PlusOutlined />} onClick={() => add({ title: "", description: "", icon: "LuGraduationCap" } satisfies EducationService)}>
                          Add a service
                        </Button>
                      </div>
                    )}
                  </Form.List>
                </>
              ),
            },
            {
              key: "destinations",
              forceRender: true,
              label: `Destinations (${counts.destinations})`,
              children: (
                <>
                  <TabIntro>Countries students ask about. Add a country and a photo for each card.</TabIntro>
                  <Form.Item name="destinationsEyebrow" label="Small label">
                    <Input />
                  </Form.Item>
                  <Form.Item name="destinationsTitle" label="Heading">
                    <Input />
                  </Form.Item>
                  <Form.Item name="destinationsIntro" label="Intro">
                    <TextArea rows={2} />
                  </Form.Item>
                  <Form.List name="destinations">
                    {(fields, { add, remove, move }) => (
                      <div className="grid gap-3">
                        {fields.map((field, index) => (
                          <div key={field.key} className="rounded-xl border border-slate-200 p-3">
                            <Form.Item name={[field.name, "title"]} label="Country" rules={[{ required: true, message: "Enter a country" }]}>
                              <Input />
                            </Form.Item>
                            <Form.Item name={[field.name, "description"]} label="Description">
                              <TextArea rows={2} />
                            </Form.Item>
                            <Form.Item name={[field.name, "image"]} label="Photo">
                              <ImageUrlUploadField uploadType="visa" previewHeightClassName="h-24" />
                            </Form.Item>
                            <Space>
                              <Button size="small" icon={<ArrowUpOutlined />} disabled={index === 0} onClick={() => move(index, index - 1)}>Up</Button>
                              <Button size="small" icon={<ArrowDownOutlined />} disabled={index === fields.length - 1} onClick={() => move(index, index + 1)}>Down</Button>
                              <Button size="small" danger icon={<DeleteOutlined />} onClick={() => remove(field.name)}>Remove</Button>
                            </Space>
                          </div>
                        ))}
                        <Button icon={<PlusOutlined />} onClick={() => add({ title: "", description: "", image: "" } satisfies EducationDestination)}>
                          Add a country
                        </Button>
                      </div>
                    )}
                  </Form.List>
                </>
              ),
            },
            {
              key: "documents",
              forceRender: true,
              label: `Documents (${counts.documents})`,
              children: (
                <>
                  <TabIntro>The papers students usually need. One line per paper.</TabIntro>
                  <Form.Item name="documentsEyebrow" label="Small label">
                    <Input />
                  </Form.Item>
                  <Form.Item name="documentsTitle" label="Heading">
                    <Input />
                  </Form.Item>
                  <Form.Item name="documentsIntro" label="Intro">
                    <TextArea rows={2} />
                  </Form.Item>
                  <Form.Item name="documentsImage" label="Photo">
                    <ImageUrlUploadField uploadType="visa" />
                  </Form.Item>
                  <Form.List name="documents">
                    {(fields, { add, remove, move }) => (
                      <div className="grid gap-3">
                        {fields.map((field, index) => (
                          <div key={field.key} className="flex items-start gap-2">
                            <Form.Item className="mb-0 flex-1" name={[field.name, "text"]} rules={[{ required: true, message: "Enter the document" }]}>
                              <Input placeholder="Passport with enough validity" />
                            </Form.Item>
                            <Space>
                              <Button size="small" icon={<ArrowUpOutlined />} disabled={index === 0} onClick={() => move(index, index - 1)} />
                              <Button size="small" icon={<ArrowDownOutlined />} disabled={index === fields.length - 1} onClick={() => move(index, index + 1)} />
                              <Button size="small" danger icon={<DeleteOutlined />} onClick={() => remove(field.name)} />
                            </Space>
                          </div>
                        ))}
                        <Button icon={<PlusOutlined />} onClick={() => add({ text: "" } satisfies EducationDocument)}>
                          Add a document
                        </Button>
                      </div>
                    )}
                  </Form.List>
                </>
              ),
            },
            {
              key: "steps",
              forceRender: true,
              label: `Steps (${counts.steps})`,
              children: (
                <>
                  <TabIntro>The numbered process. The last word of the heading is colored.</TabIntro>
                  <Form.Item name="stepsEyebrow" label="Small label">
                    <Input />
                  </Form.Item>
                  <Form.Item name="stepsTitle" label="Heading">
                    <Input />
                  </Form.Item>
                  <Form.Item name="stepsIntro" label="Intro">
                    <TextArea rows={2} />
                  </Form.Item>
                  <Form.List name="steps">
                    {(fields, { add, remove, move }) => (
                      <div className="grid gap-3">
                        {fields.map((field, index) => (
                          <div key={field.key} className="rounded-xl border border-slate-200 p-3">
                            <Form.Item name={[field.name, "title"]} label={`Step ${index + 1} title`} rules={[{ required: true, message: "Enter a title" }]}>
                              <Input />
                            </Form.Item>
                            <Form.Item name={[field.name, "description"]} label="Description">
                              <TextArea rows={2} />
                            </Form.Item>
                            <Space>
                              <Button size="small" icon={<ArrowUpOutlined />} disabled={index === 0} onClick={() => move(index, index - 1)}>Up</Button>
                              <Button size="small" icon={<ArrowDownOutlined />} disabled={index === fields.length - 1} onClick={() => move(index, index + 1)}>Down</Button>
                              <Button size="small" danger icon={<DeleteOutlined />} onClick={() => remove(field.name)}>Remove</Button>
                            </Space>
                          </div>
                        ))}
                        <Button icon={<PlusOutlined />} onClick={() => add({ title: "", description: "" } satisfies EducationStep)}>
                          Add a step
                        </Button>
                      </div>
                    )}
                  </Form.List>
                </>
              ),
            },
            {
              key: "visit",
              forceRender: true,
              label: "Visit",
              children: (
                <>
                  <TabIntro>The headings and button labels. Phone, email, address, and the map come from Dashboard, then Settings.</TabIntro>
                  <Form.Item name="visitEyebrow" label="Small label">
                    <Input />
                  </Form.Item>
                  <Form.Item name="visitTitle" label="Heading">
                    <Input />
                  </Form.Item>
                  <Form.Item name="visitBody" label="Paragraph">
                    <TextArea rows={3} />
                  </Form.Item>
                  <Row gutter={12}>
                    <Col span={12}>
                      <Form.Item name="visitCallLabel" label="Call button">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="visitOfficeLabel" label="Directions button">
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              ),
            },
            {
              key: "enquiry",
              forceRender: true,
              label: "Enquiry",
              children: (
                <>
                  <TabIntro>The form at the bottom. Name and phone stay required. Email, country, and message stay optional.</TabIntro>
                  <Form.Item name="inquiryEyebrow" label="Small label">
                    <Input />
                  </Form.Item>
                  <Form.Item name="inquiryTitle" label="Heading">
                    <Input />
                  </Form.Item>
                  <Form.Item name="inquiryIntro" label="Intro">
                    <TextArea rows={3} />
                  </Form.Item>
                  <Form.Item name="inquiryButton" label="Button label">
                    <Input />
                  </Form.Item>
                </>
              ),
            },
          ]}
        />
      </Form>
    </Modal>
  );
}
