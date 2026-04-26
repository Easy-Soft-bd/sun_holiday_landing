"use client";

import { MinusCircleOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Input, InputNumber, Modal, Select, Space, Tabs, message } from "antd";
import type { TabsProps } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ImageUrlUploadField from "@/src/components/common/ImageUrlUploadField";
import type { ResortsListingPageData } from "@/src/lib/data/resorts-listing-page";
import { mergeResortsListingPageData } from "@/src/lib/data/resorts-listing-page";

const { TextArea } = Input;

type FormValues = Omit<ResortsListingPageData, "metaKeywords"> & {
  metaKeywordsText: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<ResortsListingPageData> | null;
};

function normalizeResortsFromForm(
  resorts: ResortsListingPageData["resorts"]
): ResortsListingPageData["resorts"] {
  return resorts.map((r) => ({
    ...r,
    id: String(r.id || "").trim() || `listing-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    rating: Math.min(5, Math.max(1, Number(r.rating) || 5)),
    category: r.category === "city" ? "city" : "beach",
    status: r.status === "available" ? "available" : "coming-soon",
    features: (Array.isArray(r.features) ? r.features : [])
      .map((f) => String(f).trim())
      .filter(Boolean),
  }));
}

export default function ResortsListingEditModal({ isOpen, onClose, initialData }: Props) {
  const router = useRouter();
  const [form] = Form.useForm<FormValues>();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const m = mergeResortsListingPageData(initialData);
    const { metaKeywords, ...rest } = m;
    form.setFieldsValue({
      ...rest,
      metaKeywordsText: metaKeywords.join(", "),
    });
  }, [isOpen, initialData, form]);

  const handleSave = async (values: FormValues) => {
    setIsSaving(true);
    try {
      const { metaKeywordsText, ...rest } = values;
      const payload: ResortsListingPageData = {
        ...rest,
        metaKeywords: metaKeywordsText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        resorts: normalizeResortsFromForm(rest.resorts || []),
      };

      const response = await fetch("/api/home-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "resorts_listing_page", data: payload }),
      });

      if (response.ok) {
        message.success("Resorts page updated");
        router.refresh();
        onClose();
      } else {
        message.error("Failed to save");
      }
    } catch (e) {
      console.error(e);
      message.error("Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const tabItems = useMemo<TabsProps["items"]>(
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
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item
              name="metaKeywordsText"
              label="Meta keywords"
              extra="Comma-separated"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="metaOgImage" label="OG image" rules={[{ required: true }]}>
              <ImageUrlUploadField uploadType="tour" placeholder="/… or https://…" previewHeightClassName="h-24" />
            </Form.Item>
          </>
        ),
      },
      {
        key: "hero",
        label: "Hero",
        children: (
          <>
            <Form.Item name="heroBackgroundImage" label="Hero background" rules={[{ required: true }]}>
              <ImageUrlUploadField uploadType="tour" previewHeightClassName="h-32" />
            </Form.Item>
            <Form.Item name="heroBadge" label="Badge" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Space.Compact className="w-full">
              <Form.Item className="w-1/2 pr-2" name="heroTitleBefore" label="Title (before accent)" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item className="w-1/2 pl-2" name="heroTitleAccent" label="Accent word" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Space.Compact>
            <Form.Item name="heroTagline" label="Tagline" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="heroDescription" label="Description" rules={[{ required: true }]}>
              <TextArea rows={3} />
            </Form.Item>
          </>
        ),
      },
      {
        key: "stats",
        label: "Stats",
        children: (
          <>
            <p className="mb-3 text-sm text-base-content/60">
              Property, beach, and city counts are calculated from your listings below.
            </p>
            <Form.Item name="statGuestsValue" label="Guests stat value" rules={[{ required: true }]}>
              <Input placeholder="10K+" />
            </Form.Item>
            <Form.Item name="statGuestsLabel" label="Guests stat label" rules={[{ required: true }]}>
              <Input placeholder="Happy Guests" />
            </Form.Item>
          </>
        ),
      },
      {
        key: "sections",
        label: "Sections",
        children: (
          <>
            <Divider titlePlacement="left">Beach block</Divider>
            <Form.Item name="beachSectionEyebrow" label="Eyebrow" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Space.Compact className="w-full">
              <Form.Item className="w-1/2 pr-2" name="beachSectionTitleBefore" label="Title (before)" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item className="w-1/2 pl-2" name="beachSectionTitleAccent" label="Accent" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Space.Compact>
            <Form.Item name="beachSectionDescription" label="Description" rules={[{ required: true }]}>
              <TextArea rows={2} />
            </Form.Item>

            <Divider titlePlacement="left">City block</Divider>
            <Form.Item name="citySectionEyebrow" label="Eyebrow" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Space.Compact className="w-full">
              <Form.Item className="w-1/2 pr-2" name="citySectionTitleBefore" label="Title (before)" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item className="w-1/2 pl-2" name="citySectionTitleAccent" label="Accent" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Space.Compact>
            <Form.Item name="citySectionDescription" label="Description" rules={[{ required: true }]}>
              <TextArea rows={2} />
            </Form.Item>
          </>
        ),
      },
      {
        key: "cta",
        label: "CTA",
        children: (
          <>
            <Space.Compact className="w-full">
              <Form.Item className="w-1/2 pr-2" name="ctaTitleBefore" label="Title (before)" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item className="w-1/2 pl-2" name="ctaTitleAccent" label="Accent (verb)" rules={[{ required: true }]}>
                <Input placeholder="Book" />
              </Form.Item>
            </Space.Compact>
            <Form.Item name="ctaDescription" label="Description" rules={[{ required: true }]}>
              <TextArea rows={3} />
            </Form.Item>
            <Space.Compact className="w-full">
              <Form.Item className="w-1/2 pr-2" name="ctaPrimaryLabel" label="Primary button" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item className="w-1/2 pl-2" name="ctaPrimaryHref" label="Primary link" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Space.Compact>
            <Space.Compact className="w-full">
              <Form.Item className="w-1/2 pr-2" name="ctaSecondaryLabel" label="Secondary button" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item className="w-1/2 pl-2" name="ctaSecondaryHref" label="Secondary link" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Space.Compact>
          </>
        ),
      },
      {
        key: "listings",
        label: "Listings",
        children: (
          <Form.List name="resorts">
            {(fields, { add, remove }) => (
              <div className="space-y-6">
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-slate-500">Property {name + 1}</span>
                      <Button type="text" danger icon={<MinusCircleOutlined />} onClick={() => remove(name)}>
                        Remove
                      </Button>
                    </div>

                    <Form.Item {...restField} name={[name, "id"]} label="Stable ID (slug)" rules={[{ required: true }]}>
                      <Input placeholder="sailor-moon" />
                    </Form.Item>
                    <Space.Compact className="w-full">
                      <Form.Item className="w-1/2 pr-2" {...restField} name={[name, "name"]} label="Name" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                      <Form.Item className="w-1/2 pl-2" {...restField} name={[name, "tagline"]} label="Tagline" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                    </Space.Compact>
                    <Form.Item {...restField} name={[name, "location"]} label="Location" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Space.Compact className="w-full">
                      <Form.Item className="w-1/3 pr-2" {...restField} name={[name, "category"]} label="Category" rules={[{ required: true }]}>
                        <Select
                          options={[
                            { value: "beach", label: "Beach" },
                            { value: "city", label: "City" },
                          ]}
                        />
                      </Form.Item>
                      <Form.Item className="w-1/3 px-1" {...restField} name={[name, "status"]} label="Status" rules={[{ required: true }]}>
                        <Select
                          options={[
                            { value: "available", label: "Available" },
                            { value: "coming-soon", label: "Coming soon" },
                          ]}
                        />
                      </Form.Item>
                      <Form.Item className="w-1/3 pl-2" {...restField} name={[name, "rating"]} label="Stars" rules={[{ required: true }]}>
                        <InputNumber min={1} max={5} className="w-full" />
                      </Form.Item>
                    </Space.Compact>
                    <Form.Item {...restField} name={[name, "image"]} label="Image" rules={[{ required: true }]}>
                      <ImageUrlUploadField uploadType="tour" previewHeightClassName="h-28" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "description"]} label="Description" rules={[{ required: true }]}>
                      <TextArea rows={3} />
                    </Form.Item>
                    <Space.Compact className="w-full">
                      <Form.Item className="w-1/2 pr-2" {...restField} name={[name, "established"]} label="Established">
                        <Input placeholder="2022 or Coming Soon" />
                      </Form.Item>
                      <Form.Item className="w-1/2 pl-2" {...restField} name={[name, "href"]} label="Link path" rules={[{ required: true }]}>
                        <Input placeholder="/sailor-moon-resorts" />
                      </Form.Item>
                    </Space.Compact>

                    <Divider titlePlacement="left">Features</Divider>
                    <Form.List name={[name, "features"]}>
                      {(featureFields, { add: addF, remove: removeF }) => (
                        <div className="space-y-2">
                          {featureFields.map(({ key: featureKey, name: featureName, ...featureFieldRest }) => (
                            <Space key={featureKey} className="flex w-full">
                              <Form.Item
                                {...featureFieldRest}
                                name={[featureName]}
                                className="mb-0 flex-1"
                                rules={[{ required: true, message: "Feature text" }]}
                              >
                                <Input placeholder="Beachfront access" />
                              </Form.Item>
                              <Button type="text" danger icon={<MinusCircleOutlined />} onClick={() => removeF(featureName)} />
                            </Space>
                          ))}
                          <Button type="dashed" onClick={() => addF("")} block icon={<PlusOutlined />} size="small">
                            Add feature
                          </Button>
                        </div>
                      )}
                    </Form.List>
                  </div>
                ))}
                <Button
                  type="dashed"
                  onClick={() =>
                    add({
                      id: `listing-${Date.now()}`,
                      name: "",
                      tagline: "",
                      location: "",
                      category: "beach",
                      rating: 5,
                      image: "",
                      description: "",
                      features: [""],
                      established: "",
                      href: "/",
                      status: "available",
                    })
                  }
                  block
                  icon={<PlusOutlined />}
                >
                  Add property
                </Button>
              </div>
            )}
          </Form.List>
        ),
      },
    ],
    []
  );

  return (
    <Modal
      title="Edit Resorts listing page"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width={1080}
      styles={{ body: { maxHeight: "86vh", overflowY: "auto", paddingTop: 8 } }}
    >
      <Form form={form} layout="vertical" onFinish={(v) => void handleSave(v as FormValues)} requiredMark={false}>
        <Tabs items={tabItems} />

        <Form.Item className="mb-0 mt-6">
          <Space className="w-full justify-end">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isSaving} icon={<SaveOutlined />}>
              Save
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
