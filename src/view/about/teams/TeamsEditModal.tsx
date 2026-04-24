"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Col, Divider, Form, Input, Modal, Row, message } from "antd";
import { DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import type { TeamsPageData } from "./teams-page-data";
import { defaultTeamsPageData } from "./teams-page-data";
import ImageUrlUploadField from "@/src/components/common/ImageUrlUploadField";

const { TextArea } = Input;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<TeamsPageData>;
};

export default function TeamsEditModal({ isOpen, onClose, initialData }: Props) {
  const [form] = Form.useForm<TeamsPageData>();
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({ ...defaultTeamsPageData, ...initialData });
    }
  }, [isOpen, initialData, form]);

  const onFinish = async (values: TeamsPageData) => {
    setSaving(true);
    try {
      const res = await fetch("/api/home-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "about_teams_page", data: values }),
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
      footer={null}
      width={1080}
      title="Edit Teams Page"
      styles={{ body: { maxHeight: "80vh", overflowY: "auto", paddingTop: 16 } }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={defaultTeamsPageData}>
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 md:p-5">
          <h4 className="mb-4 text-base font-semibold text-slate-900">Hero & Section Content</h4>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Hero Badge" name="heroBadgeText" rules={[{ required: true }]}>
                <Input placeholder="Leadership" />
              </Form.Item>
              <Form.Item label="Hero Title Main" name="heroTitleMain" rules={[{ required: true }]}>
                <Input placeholder="Our Top" />
              </Form.Item>
              <Form.Item label="Hero Title Accent" name="heroTitleAccent" rules={[{ required: true }]}>
                <Input placeholder="Leaders" />
              </Form.Item>
              <Form.Item label="Hero Subtitle" name="heroTitleSub" rules={[{ required: true }]}>
                <Input placeholder="Meet the team" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Hero Description" name="heroDescription" rules={[{ required: true }]}>
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item label="Team Section Title" name="teamSectionTitle" rules={[{ required: true }]}>
                <Input placeholder="Our Team" />
              </Form.Item>
              <Form.Item label="Team Section Description" name="teamSectionDescription" rules={[{ required: true }]}>
                <TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <Divider />

        <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-base font-semibold text-slate-900">Top Leaders</h4>
            <span className="text-xs text-slate-500">Image preview appears automatically</span>
          </div>
          <Form.List name="directors">
            {(fields, { add, remove }) => (
              <div className="space-y-3">
                {fields.map((field) => (
                  <div key={field.key} className="rounded-xl border border-slate-200 bg-slate-50 p-3 md:p-4">
                    <Row gutter={12}>
                      <Col xs={24} md={8}>
                        <Form.Item label="Name" name={[field.name, "name"]} rules={[{ required: true }]}>
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={8}>
                        <Form.Item label="Title" name={[field.name, "title"]} rules={[{ required: true }]}>
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={8}>
                        <Form.Item label="Image URL" name={[field.name, "image"]} rules={[{ required: true }]}>
                          <ImageUrlUploadField uploadType="team" previewHeightClassName="h-24" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item className="mt-3" label="Message" name={[field.name, "message"]} rules={[{ required: true }]}>
                      <TextArea rows={4} />
                    </Form.Item>
                    <Button danger icon={<DeleteOutlined />} onClick={() => remove(field.name)}>
                      Remove leader
                    </Button>
                  </div>
                ))}
                <Button icon={<PlusOutlined />} onClick={() => add({ name: "", title: "", image: "", message: "" })}>
                  Add leader
                </Button>
              </div>
            )}
          </Form.List>
        </div>

        <Divider />

        <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
          <h4 className="mb-3 text-base font-semibold text-slate-900">Team Cards</h4>
          <Form.List name="teams">
            {(fields, { add, remove }) => (
              <div className="space-y-3">
                {fields.map((field) => (
                  <div key={field.key} className="rounded-xl border border-slate-200 bg-slate-50 p-3 md:p-4">
                    <Row gutter={12}>
                      <Col xs={24} md={8}>
                        <Form.Item label="Name" name={[field.name, "name"]} rules={[{ required: true }]}>
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={8}>
                        <Form.Item label="Position" name={[field.name, "position"]} rules={[{ required: true }]}>
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={8}>
                        <Form.Item label="Photo URL" name={[field.name, "image"]} rules={[{ required: true }]}>
                          <ImageUrlUploadField uploadType="team" previewHeightClassName="h-24" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item className="mt-3" label="Description" name={[field.name, "description"]} rules={[{ required: true }]}>
                      <TextArea rows={3} />
                    </Form.Item>
                    <Button danger icon={<DeleteOutlined />} onClick={() => remove(field.name)}>
                      Remove card
                    </Button>
                  </div>
                ))}
                <Button icon={<PlusOutlined />} onClick={() => add({ name: "", position: "", image: "", description: "" })}>
                  Add team card
                </Button>
              </div>
            )}
          </Form.List>
        </div>

        <Form.Item className="mb-0 mt-6">
          <div className="flex justify-end gap-2">
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={saving} icon={<SaveOutlined />}>
              Save Changes
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
