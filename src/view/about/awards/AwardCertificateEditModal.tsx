"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Divider, Form, Input, Modal, Select, Space, Tabs, message } from "antd";
import { MinusCircleOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import ImageUrlUploadField from "@/src/components/common/ImageUrlUploadField";
import type { AwardCertificatePageData } from "@/src/lib/data/award-certificate-page";
import { mergeAwardCertificatePageData } from "@/src/lib/data/award-certificate-page";

type FormValues = Omit<AwardCertificatePageData, "metaKeywords"> & {
  metaKeywordsText: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<AwardCertificatePageData> | null;
};

export default function AwardCertificateEditModal({ isOpen, onClose, initialData }: Props) {
  const router = useRouter();
  const [form] = Form.useForm<FormValues>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const merged = mergeAwardCertificatePageData(initialData);
    const { metaKeywords, ...rest } = merged;
    form.setFieldsValue({ ...rest, metaKeywordsText: metaKeywords.join(", ") });
  }, [isOpen, initialData, form]);

  const tabItems = useMemo(
    () => [
      {
        key: "seo",
        label: "SEO",
        children: (
          <>
            <Form.Item name="metaTitle" label="Meta title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="metaDescription" label="Meta description" rules={[{ required: true }]}>
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item name="metaKeywordsText" label="Meta keywords (comma separated)">
              <Input />
            </Form.Item>
          </>
        ),
      },
      {
        key: "hero",
        label: "Hero",
        children: (
          <>
            <Form.Item name="heroBadgeText" label="Badge text" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Space.Compact className="w-full">
              <Form.Item className="w-1/2 pr-2" name="heroTitleBefore" label="Title before" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item className="w-1/2 pl-2" name="heroTitleAccent" label="Title accent" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Space.Compact>
            <Form.Item name="heroDescription" label="Description" rules={[{ required: true }]}>
              <Input.TextArea rows={3} />
            </Form.Item>
          </>
        ),
      },
      {
        key: "gallery",
        label: "Gallery",
        children: (
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <div className="space-y-6">
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="rounded-xl border border-base-300 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-base-content/55">Item {name + 1}</span>
                      <Button type="text" danger icon={<MinusCircleOutlined />} onClick={() => remove(name)}>
                        Remove
                      </Button>
                    </div>
                    <Form.Item {...restField} name={[name, "id"]} label="Stable ID" rules={[{ required: true }]}>
                      <Input placeholder="cert-tin-bangladesh" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "title"]} label="Title" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Space.Compact className="w-full">
                      <Form.Item {...restField} className="w-1/2 pr-2" name={[name, "category"]} label="Category" rules={[{ required: true }]}>
                        <Select options={[{ value: "Award", label: "Award" }, { value: "Certificate", label: "Certificate" }]} />
                      </Form.Item>
                      <Form.Item {...restField} className="w-1/2 pl-2" name={[name, "year"]} label="Year" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                    </Space.Compact>
                    <Form.Item {...restField} name={[name, "image"]} label="Image" rules={[{ required: true }]}>
                      <ImageUrlUploadField uploadType="about" previewHeightClassName="h-28" />
                    </Form.Item>
                  </div>
                ))}
                <Button
                  type="dashed"
                  block
                  icon={<PlusOutlined />}
                  onClick={() =>
                    add({
                      id: `item-${Date.now()}`,
                      title: "",
                      category: "Certificate",
                      year: "2024",
                      image: "",
                    })
                  }
                >
                  Add gallery item
                </Button>
              </div>
            )}
          </Form.List>
        ),
      },
    ],
    []
  );

  const handleSave = async (values: FormValues) => {
    setSaving(true);
    try {
      const { metaKeywordsText, ...rest } = values;
      const payload: AwardCertificatePageData = {
        ...rest,
        metaKeywords: metaKeywordsText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const res = await fetch("/api/home-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "award_certificate_page", data: payload }),
      });
      if (!res.ok) {
        message.error("Failed to save Award & Certificate page");
        return;
      }
      message.success("Award & Certificate page updated");
      router.refresh();
      onClose();
    } catch {
      message.error("Failed to save Award & Certificate page");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title="Edit Award & Certificate page"
      open={isOpen}
      onCancel={onClose}
      width={980}
      footer={null}
      styles={{ body: { maxHeight: "84vh", overflowY: "auto" } }}
    >
      <Form form={form} layout="vertical" onFinish={handleSave} requiredMark={false}>
        <Tabs items={tabItems} />
        <Divider />
        <Form.Item className="mb-0">
          <div className="flex justify-end gap-2">
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={saving} icon={<SaveOutlined />}>
              Save
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
