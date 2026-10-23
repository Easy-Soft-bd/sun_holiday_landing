"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { App, Button, Col, Form, Input, Modal, Row, Space, Tabs } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import type { DirectorItem, TeamItem, TeamsPageData } from "./teams-page-data";
import { mergeTeamsPageData } from "./teams-page-data";
import ImageUrlUploadField from "@/src/components/common/ImageUrlUploadField";

const { TextArea } = Input;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<TeamsPageData>;
};

type TabKey = "hero" | "board" | "leadership" | "employees" | "closing";

const TAB_BY_FIELD: Record<string, TabKey> = {
  heroBadgeText: "hero",
  heroTitleMain: "hero",
  heroTitleAccent: "hero",
  heroTitleSub: "hero",
  heroDescription: "hero",
  boardStatLabel: "hero",
  leadersStatLabel: "hero",
  membersStatLabel: "hero",
  boardEyebrow: "board",
  boardTitle: "board",
  boardDescription: "board",
  board: "board",
  leadershipEyebrow: "leadership",
  leadershipTitle: "leadership",
  leadershipDescription: "leadership",
  leaderMessageLabel: "leadership",
  directors: "leadership",
  teamSectionEyebrow: "employees",
  teamSectionTitle: "employees",
  teamSectionDescription: "employees",
  teams: "employees",
  ctaTitleMain: "closing",
  ctaTitleAccent: "closing",
  ctaTitleEnd: "closing",
  ctaDescription: "closing",
  ctaPrimaryLabel: "closing",
  ctaPrimaryHref: "closing",
  ctaSecondaryLabel: "closing",
  ctaSecondaryHref: "closing",
};

const emptyDirector = (): DirectorItem => ({ name: "", title: "", image: "", message: "" });
const emptyEmployee = (): TeamItem => ({ name: "", position: "", image: "" });

export default function TeamsEditModal({ isOpen, onClose, initialData }: Props) {
  const { message } = App.useApp();
  const [form] = Form.useForm<TeamsPageData>();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("hero");
  const [counts, setCounts] = useState({ board: 0, directors: 0, teams: 0 });
  const router = useRouter();

  const syncCounts = () => {
    const values = form.getFieldsValue(true) as Partial<TeamsPageData>;
    setCounts({
      board: namedCount(values.board),
      directors: namedCount(values.directors),
      teams: namedCount(values.teams),
    });
  };

  useEffect(() => {
    if (isOpen) {
      const merged = mergeTeamsPageData(initialData);
      form.setFieldsValue(merged);
      setCounts({
        board: namedCount(merged.board),
        directors: namedCount(merged.directors),
        teams: namedCount(merged.teams),
      });
      setActiveTab("hero");
    }
  }, [isOpen, initialData, form]);

  const onFinish = async (values: TeamsPageData) => {
    setSaving(true);
    try {
      const stored = form.getFieldsValue(true) as TeamsPageData;
      const payload = mergeTeamsPageData({
        ...stored,
        ...values,
        board: values.board ?? stored.board,
        directors: values.directors ?? stored.directors,
        teams: values.teams ?? stored.teams,
      });
      const res = await fetch("/api/home-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "about_teams_page", data: payload }),
      });
      if (!res.ok) {
        message.error("Failed to save teams page");
        return;
      }
      message.success("Teams page updated");
      router.refresh();
      onClose();
    } catch {
      message.error("Failed to save teams page");
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
      destroyOnHidden
      title="Edit Teams page"
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
                  <TabIntro>The title at the top, and the counts beside it.</TabIntro>
                  <Form.Item name="heroBadgeText" label="Small label" rules={[{ required: true, message: "Enter the small label" }]}>
                    <Input placeholder="Excellence in Leadership" />
                  </Form.Item>
                  <Row gutter={12}>
                    <Col xs={24} md={12}>
                      <Form.Item name="heroTitleMain" label="Title, first words" rules={[{ required: true, message: "Enter the first words" }]}>
                        <Input placeholder="Meet The" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="heroTitleAccent" label="Title, colored words" rules={[{ required: true, message: "Enter the colored words" }]}>
                        <Input placeholder="Visionaries" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item name="heroTitleSub" label="Line under the title" rules={[{ required: true, message: "Enter the line under the title" }]}>
                    <Input placeholder="Behind Your Journey" />
                  </Form.Item>
                  <Form.Item name="heroDescription" label="Short description" rules={[{ required: true, message: "Enter the description" }]}>
                    <TextArea rows={3} placeholder="One or two sentences under the title" />
                  </Form.Item>
                  <Row gutter={12}>
                    <Col xs={24} md={8}>
                      <Form.Item name="boardStatLabel" label="Board count label" extra="Shown after the number of directors.">
                        <Input placeholder="Directors" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item name="leadersStatLabel" label="Leadership count label">
                        <Input placeholder="Leaders" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item name="membersStatLabel" label="Employee count label">
                        <Input placeholder="Employees" />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              ),
            },
            {
              key: "board",
              forceRender: true,
              label: `Board (${counts.board})`,
              children: (
                <>
                  <TabIntro>Shown first, above Leadership. The section stays hidden until you add a director.</TabIntro>
                  <SectionHeadingFields eyebrow="boardEyebrow" title="boardTitle" description="boardDescription" />
                  <PersonList
                    name="board"
                    noun="Director"
                    addLabel="Add a director"
                    roleKey="title"
                    roleLabel="Role"
                    withMessage
                    emptyItem={emptyDirector()}
                  />
                </>
              ),
            },
            {
              key: "leadership",
              forceRender: true,
              label: `Leadership (${counts.directors})`,
              children: (
                <>
                  <TabIntro>The leadership photos and short messages. This block stays under the board.</TabIntro>
                  <SectionHeadingFields
                    eyebrow="leadershipEyebrow"
                    title="leadershipTitle"
                    description="leadershipDescription"
                  />
                  <Form.Item name="leaderMessageLabel" label="Label above each message">
                    <Input placeholder="Message" />
                  </Form.Item>
                  <PersonList
                    name="directors"
                    noun="Leader"
                    addLabel="Add a leader"
                    roleKey="title"
                    roleLabel="Role"
                    withMessage
                    emptyItem={emptyDirector()}
                  />
                </>
              ),
            },
            {
              key: "employees",
              forceRender: true,
              label: `Employees (${counts.teams})`,
              children: (
                <>
                  <TabIntro>The wider team. Photo, name, and job title only.</TabIntro>
                  <SectionHeadingFields
                    eyebrow="teamSectionEyebrow"
                    title="teamSectionTitle"
                    description="teamSectionDescription"
                  />
                  <PersonList
                    name="teams"
                    noun="Employee"
                    addLabel="Add an employee"
                    roleKey="position"
                    roleLabel="Job title"
                    emptyItem={emptyEmployee()}
                  />
                </>
              ),
            },
            {
              key: "closing",
              forceRender: true,
              label: "Closing",
              children: (
                <>
                  <TabIntro>The invitation at the bottom of the page.</TabIntro>
                  <Row gutter={12}>
                    <Col xs={24} md={8}>
                      <Form.Item name="ctaTitleMain" label="Title, first words" rules={[{ required: true, message: "Enter the first words" }]}>
                        <Input placeholder="Ready to" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item name="ctaTitleAccent" label="Colored word" rules={[{ required: true, message: "Enter the colored word" }]}>
                        <Input placeholder="Travel" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item name="ctaTitleEnd" label="Title, last words">
                        <Input placeholder="With Us?" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item name="ctaDescription" label="Short description" rules={[{ required: true, message: "Enter the description" }]}>
                    <TextArea rows={3} />
                  </Form.Item>
                  <Row gutter={12}>
                    <Col xs={24} md={12}>
                      <Form.Item name="ctaPrimaryLabel" label="Main button text" rules={[{ required: true, message: "Enter the button text" }]}>
                        <Input placeholder="Contact Us" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="ctaPrimaryHref" label="Main button link" rules={[{ required: true, message: "Enter a link" }]}>
                        <Input placeholder="/contact" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="ctaSecondaryLabel" label="Second button text" rules={[{ required: true, message: "Enter the button text" }]}>
                        <Input placeholder="Explore Tours" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="ctaSecondaryHref" label="Second button link" rules={[{ required: true, message: "Enter a link" }]}>
                        <Input placeholder="/tours" />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              ),
            },
          ]}
        />
      </Form>
    </Modal>
  );
}

function namedCount(items: { name?: string }[] | undefined) {
  return (items ?? []).filter((item) => item?.name?.trim()).length;
}

function TabIntro({ children }: { children: string }) {
  return <p className="mb-3 text-sm text-slate-500">{children}</p>;
}

function SectionHeadingFields({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Row gutter={12}>
      <Col xs={24} md={8}>
        <Form.Item name={eyebrow} label="Small label" rules={[{ required: true, message: "Enter the small label" }]}>
          <Input placeholder="Board of Directors" />
        </Form.Item>
      </Col>
      <Col xs={24} md={16}>
        <Form.Item name={title} label="Heading" extra="The last word is shown in color." rules={[{ required: true, message: "Enter the heading" }]}>
          <Input placeholder="Our Board" />
        </Form.Item>
      </Col>
      <Col xs={24}>
        <Form.Item name={description} label="Short description">
          <TextArea rows={2} />
        </Form.Item>
      </Col>
    </Row>
  );
}

function PersonList({
  name,
  noun,
  addLabel,
  roleKey,
  roleLabel,
  withMessage = false,
  emptyItem,
}: {
  name: "board" | "directors" | "teams";
  noun: string;
  addLabel: string;
  roleKey: "title" | "position";
  roleLabel: string;
  withMessage?: boolean;
  emptyItem: DirectorItem | TeamItem;
}) {
  return (
    <Form.List name={name}>
      {(fields, { add, remove, move }) => (
        <div className="space-y-3">
          {fields.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
              No {noun.toLowerCase()}s yet.
            </p>
          ) : null}
          {fields.map((field, index) => (
            <PersonCard
              key={field.key}
              listName={name}
              fieldName={field.name}
              index={index}
              total={fields.length}
              noun={noun}
              roleKey={roleKey}
              roleLabel={roleLabel}
              withMessage={withMessage}
              onMoveUp={() => move(index, index - 1)}
              onMoveDown={() => move(index, index + 1)}
              onRemove={() => remove(field.name)}
            />
          ))}
          <Button icon={<PlusOutlined />} onClick={() => add({ ...emptyItem })}>
            {addLabel}
          </Button>
        </div>
      )}
    </Form.List>
  );
}

function PersonCard({
  listName,
  fieldName,
  index,
  total,
  noun,
  roleKey,
  roleLabel,
  withMessage,
  onMoveUp,
  onMoveDown,
  onRemove,
}: {
  listName: "board" | "directors" | "teams";
  fieldName: number;
  index: number;
  total: number;
  noun: string;
  roleKey: "title" | "position";
  roleLabel: string;
  withMessage: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}) {
  const form = Form.useFormInstance();
  const person = Form.useWatch([listName, fieldName], form) as { name?: string; title?: string; position?: string } | undefined;
  const personName = person?.name?.trim() || `${noun} ${index + 1}`;
  const role = (roleKey === "title" ? person?.title : person?.position)?.trim();

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 md:p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{personName}</p>
          <p className="truncate text-xs text-slate-500">{role || "Role not set"}</p>
        </div>
        <Space size={4}>
          <Button size="small" aria-label={`Move ${noun.toLowerCase()} up`} disabled={index === 0} icon={<ArrowUpOutlined />} onClick={onMoveUp} />
          <Button
            size="small"
            aria-label={`Move ${noun.toLowerCase()} down`}
            disabled={index === total - 1}
            icon={<ArrowDownOutlined />}
            onClick={onMoveDown}
          />
          <Button size="small" danger aria-label={`Remove ${noun.toLowerCase()}`} icon={<DeleteOutlined />} onClick={onRemove} />
        </Space>
      </div>
      <Row gutter={12}>
        <Col xs={24} md={8}>
          <Form.Item name={[fieldName, "name"]} label="Name" rules={[{ required: true, message: "Enter a name" }]}>
            <Input placeholder="Full name" />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name={[fieldName, roleKey]} label={roleLabel} rules={[{ required: true, message: `Enter a ${roleLabel.toLowerCase()}` }]}>
            <Input placeholder={roleLabel} />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name={[fieldName, "image"]} label="Photo">
            <ImageUrlUploadField uploadType="team" previewHeightClassName="h-24" />
          </Form.Item>
        </Col>
      </Row>
      {withMessage ? (
        <Form.Item name={[fieldName, "message"]} label="Message" extra="A short note shown under the photo. You can leave this blank.">
          <TextArea rows={3} placeholder="A short message for visitors" />
        </Form.Item>
      ) : null}
    </div>
  );
}
