"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { App, Button, Form, Input, Modal, Select, Space, Upload } from "antd";
import type { NamePath } from "antd/es/form/interface";
import { DeleteOutlined, LinkOutlined, PlusOutlined, SaveOutlined, UploadOutlined } from "@ant-design/icons";
import type { ResortSectionKey, SunviaEcoResortPageData } from "@/src/lib/data/sunvia-eco-resort";
import { defaultSunviaEcoResortPageData } from "@/src/lib/data/sunvia-eco-resort";
import { SECTION_FORMS, blankListItem, type ObjectListField, type SectionField } from "./section-form-schema";

const { TextArea } = Input;

interface SectionEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: ResortSectionKey;
  title: string;
  initialData: SunviaEcoResortPageData[ResortSectionKey];
}

function splitCommaText(value?: string) {
  return (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function prepareInitialValues(section: ResortSectionKey, initialData: SunviaEcoResortPageData[ResortSectionKey]) {
  if (section === "investor_seo" && initialData && "metaKeywords" in initialData) {
    return {
      ...initialData,
      metaKeywordsText: initialData.metaKeywords.join(", "),
    };
  }
  return initialData;
}

function normalizePayload(section: ResortSectionKey, values: Record<string, unknown>) {
  const output: Record<string, unknown> = {};
  for (const field of SECTION_FORMS[section]) {
    if (field.kind === "keywords") {
      output.metaKeywords = splitCommaText(values.metaKeywordsText as string);
      continue;
    }
    if (field.kind === "stringList") {
      const rawList = values[field.name];
      const list = Array.isArray(rawList) ? rawList : [];
      output[field.name] = list.map((item: unknown) => String(item ?? "").trim()).filter(Boolean);
      continue;
    }
    if (field.kind === "list") {
      const rawList = values[field.name];
      const list = Array.isArray(rawList) ? rawList : [];
      output[field.name] = list.map((item: unknown) => {
        const record = (item ?? {}) as Record<string, unknown>;
        const next: Record<string, unknown> = {};
        for (const child of field.itemFields) {
          next[child.name] = record[child.name];
        }
        return next;
      });
      continue;
    }
    output[field.name] = values[field.name];
  }
  return output;
}

function UploadField({
  form,
  name,
  storeName,
  label,
}: {
  form: ReturnType<typeof Form.useForm>[0];
  name: NamePath;
  storeName?: NamePath;
  label: string;
}) {
  const { message } = App.useApp();
  const path = storeName ?? name;
  const imageUrl = Form.useWatch(path, form);

  return (
    <Form.Item label={label}>
      <div className="flex flex-col gap-4">
        <Space.Compact style={{ width: "100%" }}>
          <Form.Item name={name} noStyle>
            <Input placeholder={`${label} URL`} />
          </Form.Item>
          {imageUrl ? (
            <Button type="default" href={imageUrl} target="_blank" icon={<LinkOutlined />}>
              View
            </Button>
          ) : null}
        </Space.Compact>
        <Upload
          name="file"
          action="/api/upload"
          data={{ oldPath: imageUrl }}
          showUploadList={false}
          onChange={(info) => {
            if (info.file.status === "done") {
              const url = info.file.response?.url;
              if (url) {
                form.setFieldValue(path, url);
                message.success(`${info.file.name} uploaded successfully`);
              }
            } else if (info.file.status === "error") {
              message.error(`${info.file.name} upload failed.`);
            }
          }}
        >
          <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>
        {imageUrl ? (
          <div className="relative h-36 w-full overflow-hidden rounded-lg border border-base-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={label} className="h-full w-full object-cover" />
          </div>
        ) : null}
      </div>
    </Form.Item>
  );
}

function ObjectList({
  field,
  form,
}: {
  field: ObjectListField;
  form: ReturnType<typeof Form.useForm>[0];
}) {
  return (
    <Form.List name={field.name}>
      {(items, { add, remove }) => (
        <div className="mb-6">
          <div className="mb-3 font-semibold">{field.label}</div>
          <div className="flex flex-col gap-4">
            {items.map((item, index) => (
              <div key={item.key} className="rounded-xl border border-base-300 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-base-content/60">Item {index + 1}</span>
                  <Button danger type="text" icon={<DeleteOutlined />} onClick={() => remove(item.name)}>
                    Remove
                  </Button>
                </div>
                {field.itemFields.map((child) =>
                  child.kind === "image" ? (
                    <UploadField
                      key={child.name}
                      form={form}
                      name={[item.name, child.name]}
                      storeName={[field.name, item.name, child.name]}
                      label={child.label}
                    />
                  ) : child.kind === "select" ? (
                    <Form.Item key={child.name} name={[item.name, child.name]} label={child.label}>
                      <Select options={child.options} />
                    </Form.Item>
                  ) : (
                    <Form.Item key={child.name} name={[item.name, child.name]} label={child.label}>
                      {child.kind === "textarea" ? <TextArea rows={3} /> : <Input />}
                    </Form.Item>
                  ),
                )}
              </div>
            ))}
          </div>
          <Button className="mt-3" icon={<PlusOutlined />} onClick={() => add(blankListItem(field))}>
            {field.addLabel}
          </Button>
        </div>
      )}
    </Form.List>
  );
}

function renderField(field: SectionField, form: ReturnType<typeof Form.useForm>[0]) {
  if (field.kind === "image") {
    return <UploadField key={field.name} form={form} name={field.name} label={field.label} />;
  }
  if (field.kind === "keywords") {
    return (
      <Form.Item key={field.name} name={field.name} label={field.label}>
        <Input placeholder="Sunvia Hotel & Resort, Manikganj" />
      </Form.Item>
    );
  }
  if (field.kind === "stringList") {
    return (
      <Form.List key={field.name} name={field.name}>
        {(items, { add, remove }) => (
          <div className="mb-6">
            <div className="mb-3 font-semibold">{field.label}</div>
            <div className="flex flex-col gap-2">
              {items.map((item, index) => (
                <Space.Compact key={item.key} style={{ width: "100%" }}>
                  <Form.Item name={item.name} noStyle>
                    <Input placeholder={`Line ${index + 1}`} />
                  </Form.Item>
                  <Button danger icon={<DeleteOutlined />} onClick={() => remove(item.name)} />
                </Space.Compact>
              ))}
            </div>
            <Button className="mt-3" icon={<PlusOutlined />} onClick={() => add("")}>
              {field.addLabel}
            </Button>
          </div>
        )}
      </Form.List>
    );
  }
  if (field.kind === "list") {
    return <ObjectList key={field.name} field={field} form={form} />;
  }
  return (
    <Form.Item key={field.name} name={field.name} label={field.label}>
      {field.kind === "textarea" ? <TextArea rows={4} /> : <Input />}
    </Form.Item>
  );
}

export default function SectionEditModal({
  isOpen,
  onClose,
  section,
  title,
  initialData,
}: SectionEditModalProps) {
  const { message } = App.useApp();
  const router = useRouter();
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);
  const defaultData = useMemo(() => defaultSunviaEcoResortPageData[section], [section]);
  const fields = SECTION_FORMS[section];

  useEffect(() => {
    if (!isOpen) return;
    form.setFieldsValue(prepareInitialValues(section, initialData ?? defaultData));
  }, [defaultData, form, initialData, isOpen, section]);

  const handleSave = async () => {
    const values = form.getFieldsValue(true) as Record<string, unknown>;
    setIsSaving(true);
    try {
      const response = await fetch("/api/sunvia-eco-resort", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data: normalizePayload(section, values) }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        message.error(result.error || "Failed to save changes");
        return;
      }
      message.success(`${title} updated successfully.`);
      router.refresh();
      onClose();
    } catch (error) {
      console.error("Error saving Sunvia Hotel & Resort section:", error);
      message.error("Error saving changes");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      title={title}
      open={isOpen}
      onCancel={onClose}
      width={860}
      destroyOnHidden
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="save" type="primary" icon={<SaveOutlined />} loading={isSaving} onClick={handleSave}>
          Save
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" className="max-h-[70vh] overflow-y-auto pr-2">
        {fields.map((field) => renderField(field, form))}
      </Form>
    </Modal>
  );
}
