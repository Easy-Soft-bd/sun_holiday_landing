"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { App, Button, Col, Form, Input, Modal, Row, Space, Tabs } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import type { AboutPageData, AboutPoint, AboutSocialLink } from "./about-page-data";
import { mergeAboutPageData } from "./about-page-data";
import RichTextEditor from "@/src/components/common/RichTextEditor";
import ImageUrlUploadField from "@/src/components/common/ImageUrlUploadField";
import IconPicker from "@/src/components/common/IconPicker";
import { DEFAULT_SOCIAL_ICON, sanitizeSocialUrl } from "@/src/lib/social-links";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<AboutPageData>;
};

type TabKey = "hero" | "story" | "vision" | "values" | "strategy" | "office" | "social";

const TAB_BY_FIELD: Record<string, TabKey> = {
  heroBadgeText: "hero",
  heroTitleLead: "hero",
  heroTitleAccent: "hero",
  heroTitleSub: "hero",
  heroDescription: "hero",
  heroBackgroundImage: "hero",
  storyImage: "story",
  storyImageAlt: "story",
  storyCaption: "story",
  storyBadgeText: "story",
  storyTitle: "story",
  storyParagraph1: "story",
  storyParagraph2: "story",
  visionTitle: "vision",
  visionIcon: "vision",
  visionParagraph1: "vision",
  visionParagraph2: "vision",
  missionTitle: "vision",
  missionIcon: "vision",
  missionParagraph1: "vision",
  missionParagraph2: "vision",
  valuesBadgeText: "values",
  valuesTitle: "values",
  valuesIntro: "values",
  values: "values",
  strategyBadgeText: "strategy",
  strategyTitle: "strategy",
  strategyIntro: "strategy",
  strategy: "strategy",
  officeTitle: "office",
  officeAddressHtml: "office",
  contactButtonText: "office",
  contactButtonLink: "office",
  callButtonText: "office",
  callButtonLink: "office",
  socialBadgeText: "social",
  socialTitle: "social",
  socialIntro: "social",
  socialLinks: "social",
};

export default function AboutEditModal({ isOpen, onClose, initialData }: Props) {
  const { message } = App.useApp();
  const router = useRouter();
  const [form] = Form.useForm<AboutPageData>();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("hero");

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue(mergeAboutPageData(initialData));
      setActiveTab("hero");
    }
  }, [isOpen, initialData, form]);

  const handleSave = async (values: AboutPageData) => {
    setSaving(true);
    try {
      const lead = values.heroTitleLead.trim();
      const accent = values.heroTitleAccent.trim();
      const payload: AboutPageData = {
        ...values,
        heroTitleLead: lead,
        heroTitleAccent: accent,
        heroTitleMain: [lead, accent].filter(Boolean).join(" "),
        values: cleanPoints(values.values),
        strategy: cleanPoints(values.strategy),
        socialLinks: cleanSocialLinks(values.socialLinks),
      };
      const res = await fetch("/api/home-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "about_page", data: payload }),
      });
      if (!res.ok) {
        message.error("Failed to save About page");
        return;
      }
      message.success("About page updated");
      router.refresh();
      onClose();
    } catch {
      message.error("Failed to save About page");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title="Edit About page"
      open={isOpen}
      onCancel={onClose}
      width={880}
      centered
      destroyOnHidden
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
        onFinish={(values) => void handleSave(values)}
        onFinishFailed={({ errorFields }) => {
          const field = String(errorFields[0]?.name?.[0] ?? "");
          setActiveTab(TAB_BY_FIELD[field] ?? "hero");
          message.warning("Check the highlighted fields before saving.");
        }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as TabKey)}
          tabBarStyle={{ marginBottom: 8 }}
          items={[
            {
              key: "hero",
              label: "Hero",
              children: (
                <>
                  <TabIntro>The top of the page: the label, title, short line, and background photo.</TabIntro>
                  <Form.Item name="heroBadgeText" label="Small label" extra="The pill above the title." rules={[{ required: true, message: "Enter the small label" }]}>
                    <Input placeholder="Est. Nov 8, 2021" />
                  </Form.Item>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="heroTitleLead" label="Title, first words" extra="Shown in black, before the colored words.">
                        <Input placeholder="About" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="heroTitleAccent" label="Title, colored words" rules={[{ required: true, message: "Enter the colored title words" }]}>
                        <Input placeholder="Sun Tourism" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item name="heroTitleSub" label="Line under the title" rules={[{ required: true, message: "Enter the line under the title" }]}>
                    <Input placeholder="Crafting Unforgettable Journeys" />
                  </Form.Item>
                  <Form.Item name="heroDescription" label="Short description" rules={[{ required: true, message: "Enter the description" }]}>
                    <RichTextEditor compact placeholder="One or two sentences under the title" />
                  </Form.Item>
                  <Form.Item name="heroBackgroundImage" label="Background photo" rules={[{ required: true, message: "Add a background photo" }]}>
                    <ImageUrlUploadField uploadType="about" previewHeightClassName="h-28" />
                  </Form.Item>
                </>
              ),
            },
            {
              key: "story",
              label: "Story",
              children: (
                <>
                  <TabIntro>The photo and the origin story beside it.</TabIntro>
                  <Form.Item name="storyImage" label="Photo" rules={[{ required: true, message: "Add the story photo" }]}>
                    <ImageUrlUploadField uploadType="about" previewHeightClassName="h-28" />
                  </Form.Item>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="storyImageAlt" label="Photo description" extra="Used by screen readers. Describe what is in the photo." rules={[{ required: true, message: "Describe the photo" }]}>
                        <Input placeholder="Group of friends traveling" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="storyCaption" label="Caption on the photo" extra="The small label sitting on the corner of the photo." rules={[{ required: true, message: "Enter the photo caption" }]}>
                        <Input placeholder="Est. Nov 8, 2021" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="storyBadgeText" label="Section label" rules={[{ required: true, message: "Enter the section label" }]}>
                        <Input placeholder="Our Origin" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="storyTitle" label="Heading" rules={[{ required: true, message: "Enter the heading" }]}>
                        <Input placeholder="Born from Passion" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item name="storyParagraph1" label="First paragraph" rules={[{ required: true, message: "Enter the first paragraph" }]}>
                    <RichTextEditor compact placeholder="How the company started" />
                  </Form.Item>
                  <Form.Item name="storyParagraph2" label="Second paragraph" rules={[{ required: true, message: "Enter the second paragraph" }]}>
                    <RichTextEditor compact placeholder="What the founders brought with them" />
                  </Form.Item>
                </>
              ),
            },
            {
              key: "vision",
              label: "Vision & Mission",
              children: (
                <>
                  <TabIntro>The two cards under the story.</TabIntro>
                  <Row gutter={16}>
                    <Col span={16}>
                      <Form.Item name="visionTitle" label="Vision heading" rules={[{ required: true, message: "Enter the vision heading" }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name="visionIcon" label="Vision icon" rules={[{ required: true, message: "Pick an icon" }]}>
                        <IconPicker placeholder="Search icons" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item name="visionParagraph1" label="Vision, first paragraph" rules={[{ required: true, message: "Enter the first vision paragraph" }]}>
                    <RichTextEditor compact placeholder="First vision paragraph" />
                  </Form.Item>
                  <Form.Item name="visionParagraph2" label="Vision, second paragraph" rules={[{ required: true, message: "Enter the second vision paragraph" }]}>
                    <RichTextEditor compact placeholder="Second vision paragraph" />
                  </Form.Item>
                  <Row gutter={16}>
                    <Col span={16}>
                      <Form.Item name="missionTitle" label="Mission heading" rules={[{ required: true, message: "Enter the mission heading" }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name="missionIcon" label="Mission icon" rules={[{ required: true, message: "Pick an icon" }]}>
                        <IconPicker placeholder="Search icons" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item name="missionParagraph1" label="Mission, first paragraph" rules={[{ required: true, message: "Enter the first mission paragraph" }]}>
                    <RichTextEditor compact placeholder="First mission paragraph" />
                  </Form.Item>
                  <Form.Item name="missionParagraph2" label="Mission, second paragraph" rules={[{ required: true, message: "Enter the second mission paragraph" }]}>
                    <RichTextEditor compact placeholder="Second mission paragraph" />
                  </Form.Item>
                </>
              ),
            },
            {
              key: "values",
              label: "Values",
              children: (
                <>
                  <TabIntro>The Our Values heading and the cards under it. Cards stay in the order you set.</TabIntro>
                  <SectionHeadingFields badgeName="valuesBadgeText" titleName="valuesTitle" introName="valuesIntro" />
                  <PointList name="values" addLabel="Add a value" />
                </>
              ),
            },
            {
              key: "strategy",
              label: "Strategy",
              children: (
                <>
                  <TabIntro>The Our Strategy heading and the numbered steps under it.</TabIntro>
                  <SectionHeadingFields badgeName="strategyBadgeText" titleName="strategyTitle" introName="strategyIntro" />
                  <PointList name="strategy" addLabel="Add a step" />
                </>
              ),
            },
            {
              key: "office",
              label: "Office",
              children: (
                <>
                  <TabIntro>The heading and button labels stay on this page. The address, email, and phone come from Dashboard, then Settings.</TabIntro>
                  <Form.Item name="officeTitle" label="Heading" rules={[{ required: true, message: "Enter the heading" }]}>
                    <Input placeholder="Visit Our Office" />
                  </Form.Item>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="contactButtonText" label="Email button label" rules={[{ required: true, message: "Enter the button label" }]}>
                        <Input placeholder="Contact Us" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="callButtonText" label="Call button label" rules={[{ required: true, message: "Enter the button label" }]}>
                        <Input placeholder="Call Support" />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              ),
            },
            {
              key: "social",
              label: "Social",
              children: (
                <>
                  <TabIntro>The last section on the page. Profile icons come from Dashboard, then Settings, and only appear when a link is set.</TabIntro>
                  <SectionHeadingFields badgeName="socialBadgeText" titleName="socialTitle" introName="socialIntro" />
                </>
              ),
            },
          ]}
        />
      </Form>
    </Modal>
  );
}

function TabIntro({ children }: { children: string }) {
  return <p className="mb-2 text-sm leading-relaxed text-slate-500">{children}</p>;
}

function SectionHeadingFields({
  badgeName,
  titleName,
  introName,
}: {
  badgeName: "valuesBadgeText" | "strategyBadgeText" | "socialBadgeText";
  titleName: "valuesTitle" | "strategyTitle" | "socialTitle";
  introName: "valuesIntro" | "strategyIntro" | "socialIntro";
}) {
  return (
    <>
      <Row gutter={16}>
        <Col span={10}>
          <Form.Item name={badgeName} label="Small label" rules={[{ required: true, message: "Enter the label" }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={14}>
          <Form.Item name={titleName} label="Heading" rules={[{ required: true, message: "Enter the heading" }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name={introName} label="Intro line" rules={[{ required: true, message: "Enter the intro" }]}>
        <Input.TextArea rows={2} />
      </Form.Item>
    </>
  );
}

function PointList({ name, addLabel }: { name: "values" | "strategy"; addLabel: string }) {
  return (
    <Form.List name={name}>
      {(fields, { add, remove, move }) => (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.key} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Card {index + 1}</span>
                <Space size={4}>
                  <Button
                    size="small"
                    aria-label="Move card up"
                    disabled={index === 0}
                    icon={<ArrowUpOutlined />}
                    onClick={() => move(index, index - 1)}
                  />
                  <Button
                    size="small"
                    aria-label="Move card down"
                    disabled={index === fields.length - 1}
                    icon={<ArrowDownOutlined />}
                    onClick={() => move(index, index + 1)}
                  />
                  <Button size="small" danger aria-label="Remove card" icon={<DeleteOutlined />} onClick={() => remove(field.name)} />
                </Space>
              </div>
              <Row gutter={12}>
                <Col xs={24} md={15}>
                  <Form.Item name={[field.name, "title"]} label="Title" rules={[{ required: true, message: "Enter a title" }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={9}>
                  <Form.Item name={[field.name, "icon"]} label="Icon" rules={[{ required: true, message: "Pick an icon" }]}>
                    <IconPicker placeholder="Search icons" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name={[field.name, "description"]}
                label="Description"
                rules={[{ required: true, message: "Enter a description" }]}
                className="mb-0"
              >
                <Input.TextArea rows={2} />
              </Form.Item>
            </div>
          ))}
          <Button
            type="dashed"
            block
            icon={<PlusOutlined />}
            onClick={() => add({ title: "", description: "", icon: "LuStar" } satisfies AboutPoint)}
          >
            {addLabel}
          </Button>
        </div>
      )}
    </Form.List>
  );
}

function cleanSocialLinks(items: AboutSocialLink[] | undefined): AboutSocialLink[] {
  return (items ?? [])
    .map((item) => ({
      label: String(item?.label ?? "").trim(),
      icon: String(item?.icon ?? "").trim() || DEFAULT_SOCIAL_ICON,
      url: sanitizeSocialUrl(item?.url),
    }))
    .filter((item) => item.label || item.url);
}

function cleanPoints(items: AboutPoint[] | undefined): AboutPoint[] {
  return (items ?? [])
    .map((item) => ({
      title: String(item?.title ?? "").trim(),
      description: String(item?.description ?? "").trim(),
      icon: String(item?.icon ?? "").trim() || "LuStar",
    }))
    .filter((item) => item.title);
}
