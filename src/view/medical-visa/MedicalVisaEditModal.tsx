"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { App, Button, Col, Form, Input, Modal, Row, Space, Tabs } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import ImageUrlUploadField from "@/src/components/common/ImageUrlUploadField";
import IconPicker from "@/src/components/common/IconPicker";
import {
  mergeMedicalVisaPageData,
  type MedicalVisaDocument,
  type MedicalVisaPageData,
  type MedicalVisaService,
  type MedicalVisaStep,
} from "./medical-visa-page-data";

const { TextArea } = Input;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<MedicalVisaPageData>;
};

type TabKey = "hero" | "emergency" | "story" | "services" | "documents" | "steps" | "enquiry";

const TAB_BY_FIELD: Record<string, TabKey> = {
  metaTitle: "hero",
  metaDescription: "hero",
  metaKeywords: "hero",
  heroBadge: "hero",
  heroTitleMain: "hero",
  heroTitleAccent: "hero",
  heroSubtitle: "hero",
  heroDescription: "hero",
  heroImage: "hero",
  urgentEyebrow: "emergency",
  urgentTitle: "emergency",
  urgentBody: "emergency",
  urgentCallLabel: "emergency",
  urgentVisitLabel: "emergency",
  introEyebrow: "story",
  introTitle: "story",
  introBody: "story",
  introImage: "story",
  servicesEyebrow: "services",
  servicesTitle: "services",
  servicesIntro: "services",
  services: "services",
  documentsEyebrow: "documents",
  documentsTitle: "documents",
  documentsIntro: "documents",
  documents: "documents",
  stepsEyebrow: "steps",
  stepsTitle: "steps",
  stepsIntro: "steps",
  steps: "steps",
  inquiryEyebrow: "enquiry",
  inquiryTitle: "enquiry",
  inquiryIntro: "enquiry",
  inquiryButton: "enquiry",
};

function TabIntro({ children }: { children: string }) {
  return <p className="mb-3 text-sm text-slate-500">{children}</p>;
}

export default function MedicalVisaEditModal({ isOpen, onClose, initialData }: Props) {
  const { message } = App.useApp();
  const [form] = Form.useForm<MedicalVisaPageData>();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("hero");
  const [counts, setCounts] = useState({ services: 0, documents: 0, steps: 0 });
  const router = useRouter();

  const syncCounts = () => {
    const values = form.getFieldsValue(true) as Partial<MedicalVisaPageData>;
    setCounts({
      services: Array.isArray(values.services) ? values.services.filter((item) => item?.title?.trim()).length : 0,
      documents: Array.isArray(values.documents) ? values.documents.filter((item) => item?.text?.trim()).length : 0,
      steps: Array.isArray(values.steps) ? values.steps.filter((item) => item?.title?.trim()).length : 0,
    });
  };

  useEffect(() => {
    if (!isOpen) return;
    const merged = mergeMedicalVisaPageData(initialData);
    form.setFieldsValue(merged);
    setCounts({
      services: merged.services.length,
      documents: merged.documents.length,
      steps: merged.steps.length,
    });
    setActiveTab("hero");
  }, [isOpen, initialData, form]);

  const onFinish = async (values: MedicalVisaPageData) => {
    setSaving(true);
    try {
      const stored = form.getFieldsValue(true) as MedicalVisaPageData;
      const payload = mergeMedicalVisaPageData({
        ...stored,
        ...values,
        services: values.services ?? stored.services,
        documents: values.documents ?? stored.documents,
        steps: values.steps ?? stored.steps,
      });
      const res = await fetch("/api/home-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "medical_visa_page", data: payload }),
      });
      if (!res.ok) {
        message.error("Failed to save Medical Visa page");
        return;
      }
      message.success("Medical Visa page updated");
      router.refresh();
      onClose();
    } catch {
      message.error("Failed to save Medical Visa page");
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
      title="Edit Medical Visa page"
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
              key: "hero",
              forceRender: true,
              label: "Hero",
              children: (
                <>
                  <TabIntro>The banner at the top, and the title used in search results.</TabIntro>
                  <Form.Item name="heroBadge" label="Small label" rules={[{ required: true, message: "Enter the small label" }]}>
                    <Input placeholder="Service" />
                  </Form.Item>
                  <Row gutter={12}>
                    <Col xs={24} md={12}>
                      <Form.Item name="heroTitleMain" label="Title, first word" rules={[{ required: true, message: "Enter the first word" }]}>
                        <Input placeholder="Medical" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="heroTitleAccent" label="Title, colored word" rules={[{ required: true, message: "Enter the colored word" }]}>
                        <Input placeholder="Visa" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item name="heroSubtitle" label="Line under the title">
                    <Input />
                  </Form.Item>
                  <Form.Item name="heroDescription" label="Short description">
                    <TextArea rows={3} />
                  </Form.Item>
                  <Form.Item name="heroImage" label="Background photo">
                    <ImageUrlUploadField uploadType="visa" />
                  </Form.Item>
                  <Form.Item name="metaTitle" label="Search result title" rules={[{ required: true, message: "Enter a search title" }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="metaDescription" label="Search result description">
                    <TextArea rows={2} />
                  </Form.Item>
                  <Form.Item name="metaKeywords" label="Search keywords" extra="Separate words with commas.">
                    <Input />
                  </Form.Item>
                </>
              ),
            },
            {
              key: "emergency",
              forceRender: true,
              label: "Emergency",
              children: (
                <>
                  <TabIntro>
                    The notice under the banner. Phone numbers, email, and the office address come from Dashboard → Settings.
                  </TabIntro>
                  <Form.Item name="urgentEyebrow" label="Small label">
                    <Input />
                  </Form.Item>
                  <Form.Item name="urgentTitle" label="Heading">
                    <Input />
                  </Form.Item>
                  <Form.Item name="urgentBody" label="Message">
                    <TextArea rows={3} />
                  </Form.Item>
                  <Row gutter={12}>
                    <Col xs={24} md={12}>
                      <Form.Item name="urgentCallLabel" label="Call button">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="urgentVisitLabel" label="Visit button">
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              ),
            },
            {
              key: "story",
              forceRender: true,
              label: "Story",
              children: (
                <>
                  <TabIntro>The photo and paragraph under the banner.</TabIntro>
                  <Form.Item name="introEyebrow" label="Small label">
                    <Input />
                  </Form.Item>
                  <Form.Item name="introTitle" label="Heading">
                    <Input />
                  </Form.Item>
                  <Form.Item name="introBody" label="Paragraph">
                    <TextArea rows={4} />
                  </Form.Item>
                  <Form.Item name="introImage" label="Photo">
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
                  <TabIntro>The cards that explain what you arrange. The last word of the heading is colored.</TabIntro>
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
                                <Form.Item
                                  name={[field.name, "title"]}
                                  label="Title"
                                  rules={[{ required: true, message: "Enter a title" }]}
                                >
                                  <Input />
                                </Form.Item>
                              </Col>
                            </Row>
                            <Form.Item name={[field.name, "description"]} label="Description">
                              <TextArea rows={2} />
                            </Form.Item>
                            <Space>
                              <Button size="small" icon={<ArrowUpOutlined />} disabled={index === 0} onClick={() => move(index, index - 1)}>
                                Up
                              </Button>
                              <Button
                                size="small"
                                icon={<ArrowDownOutlined />}
                                disabled={index === fields.length - 1}
                                onClick={() => move(index, index + 1)}
                              >
                                Down
                              </Button>
                              <Button size="small" danger icon={<DeleteOutlined />} onClick={() => remove(field.name)}>
                                Remove
                              </Button>
                            </Space>
                          </div>
                        ))}
                        <Button
                          icon={<PlusOutlined />}
                          onClick={() => add({ title: "", description: "", icon: "LuHeart" } satisfies MedicalVisaService)}
                        >
                          Add a service
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
                  <TabIntro>The papers families usually need. One line per paper.</TabIntro>
                  <Form.Item name="documentsEyebrow" label="Small label">
                    <Input />
                  </Form.Item>
                  <Form.Item name="documentsTitle" label="Heading">
                    <Input />
                  </Form.Item>
                  <Form.Item name="documentsIntro" label="Intro">
                    <TextArea rows={2} />
                  </Form.Item>
                  <Form.List name="documents">
                    {(fields, { add, remove, move }) => (
                      <div className="grid gap-3">
                        {fields.map((field, index) => (
                          <div key={field.key} className="flex items-start gap-2">
                            <Form.Item
                              className="mb-0 flex-1"
                              name={[field.name, "text"]}
                              rules={[{ required: true, message: "Enter the document" }]}
                            >
                              <Input placeholder="Passport with enough validity" />
                            </Form.Item>
                            <Space>
                              <Button size="small" icon={<ArrowUpOutlined />} disabled={index === 0} onClick={() => move(index, index - 1)} />
                              <Button
                                size="small"
                                icon={<ArrowDownOutlined />}
                                disabled={index === fields.length - 1}
                                onClick={() => move(index, index + 1)}
                              />
                              <Button size="small" danger icon={<DeleteOutlined />} onClick={() => remove(field.name)} />
                            </Space>
                          </div>
                        ))}
                        <Button icon={<PlusOutlined />} onClick={() => add({ text: "" } satisfies MedicalVisaDocument)}>
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
                            <Form.Item
                              name={[field.name, "title"]}
                              label={`Step ${index + 1} title`}
                              rules={[{ required: true, message: "Enter a title" }]}
                            >
                              <Input />
                            </Form.Item>
                            <Form.Item name={[field.name, "description"]} label="Description">
                              <TextArea rows={2} />
                            </Form.Item>
                            <Space>
                              <Button size="small" icon={<ArrowUpOutlined />} disabled={index === 0} onClick={() => move(index, index - 1)}>
                                Up
                              </Button>
                              <Button
                                size="small"
                                icon={<ArrowDownOutlined />}
                                disabled={index === fields.length - 1}
                                onClick={() => move(index, index + 1)}
                              >
                                Down
                              </Button>
                              <Button size="small" danger icon={<DeleteOutlined />} onClick={() => remove(field.name)}>
                                Remove
                              </Button>
                            </Space>
                          </div>
                        ))}
                        <Button icon={<PlusOutlined />} onClick={() => add({ title: "", description: "" } satisfies MedicalVisaStep)}>
                          Add a step
                        </Button>
                      </div>
                    )}
                  </Form.List>
                </>
              ),
            },
            {
              key: "enquiry",
              forceRender: true,
              label: "Enquiry",
              children: (
                <>
                  <TabIntro>The form at the bottom of the page. Name and phone stay required.</TabIntro>
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
