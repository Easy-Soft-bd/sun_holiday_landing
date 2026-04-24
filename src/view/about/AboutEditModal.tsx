"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Col, Form, Input, Modal, Row, Space, message } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import type { AboutPageData } from "./about-page-data";
import { defaultAboutPageData } from "./about-page-data";
import RichTextEditor from "@/src/components/common/RichTextEditor";
import ImageUrlUploadField from "@/src/components/common/ImageUrlUploadField";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<AboutPageData>;
};

export default function AboutEditModal({ isOpen, onClose, initialData }: Props) {
  const router = useRouter();
  const [form] = Form.useForm<AboutPageData>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({ ...defaultAboutPageData, ...initialData });
    }
  }, [isOpen, initialData, form]);

  const handleSave = async (values: AboutPageData) => {
    setSaving(true);
    try {
      const res = await fetch("/api/home-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "about_page", data: values }),
      });
      if (!res.ok) {
        message.error("Failed to save About page");
        return;
      }
      message.success("About page updated successfully");
      router.refresh();
      onClose();
    } catch {
      message.error("Failed to save About page");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Edit About Page" open={isOpen} onCancel={onClose} width={980} footer={null}>
      <Form form={form} layout="vertical" onFinish={handleSave} initialValues={defaultAboutPageData}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="heroBadgeText" label="Hero badge" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="heroTitleMain" label="Hero main title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="heroTitleSub" label="Hero subtitle" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="heroDescription" label="Hero description" rules={[{ required: true }]}>
              <RichTextEditor placeholder="Write hero description..." />
            </Form.Item>
            <Form.Item name="heroBackgroundImage" label="Hero background image URL" rules={[{ required: true }]}>
              <ImageUrlUploadField uploadType="about" previewHeightClassName="h-24" />
            </Form.Item>
            <Form.Item name="storyImage" label="Story image URL" rules={[{ required: true }]}>
              <ImageUrlUploadField uploadType="about" previewHeightClassName="h-24" />
            </Form.Item>
            <Form.Item name="storyBadgeText" label="Story badge text" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="storyTitle" label="Story title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="storyParagraph1" label="Story paragraph 1" rules={[{ required: true }]}>
              <RichTextEditor placeholder="Write story paragraph 1..." />
            </Form.Item>
            <Form.Item name="storyParagraph2" label="Story paragraph 2" rules={[{ required: true }]}>
              <RichTextEditor placeholder="Write story paragraph 2..." />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="visionTitle" label="Vision title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="visionParagraph1" label="Vision paragraph 1" rules={[{ required: true }]}>
              <RichTextEditor placeholder="Write vision paragraph 1..." />
            </Form.Item>
            <Form.Item name="visionParagraph2" label="Vision paragraph 2" rules={[{ required: true }]}>
              <RichTextEditor placeholder="Write vision paragraph 2..." />
            </Form.Item>
            <Form.Item name="missionTitle" label="Mission title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="missionParagraph1" label="Mission paragraph 1" rules={[{ required: true }]}>
              <RichTextEditor placeholder="Write mission paragraph 1..." />
            </Form.Item>
            <Form.Item name="missionParagraph2" label="Mission paragraph 2" rules={[{ required: true }]}>
              <RichTextEditor placeholder="Write mission paragraph 2..." />
            </Form.Item>
            <Form.Item name="officeTitle" label="Office section title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="officeAddressHtml" label="Office address" rules={[{ required: true }]}>
              <RichTextEditor placeholder="Write office address..." />
            </Form.Item>
            <Space.Compact className="w-full">
              <Form.Item className="mb-0 w-1/2 pr-2" name="contactButtonText" label="Contact button text" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item className="mb-0 w-1/2 pl-2" name="contactButtonLink" label="Contact button link" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Space.Compact>
            <Space.Compact className="mt-3 w-full">
              <Form.Item className="mb-0 w-1/2 pr-2" name="callButtonText" label="Call button text" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item className="mb-0 w-1/2 pl-2" name="callButtonLink" label="Call button link" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Space.Compact>
          </Col>
        </Row>

        <Form.Item className="mb-0 mt-8">
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
