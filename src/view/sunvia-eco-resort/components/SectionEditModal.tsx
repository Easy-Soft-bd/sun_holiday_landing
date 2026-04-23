"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Space,
  Upload,
  message,
} from "antd";
import {
  DeleteOutlined,
  LinkOutlined,
  PlusOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type {
  ResortAccommodationData,
  ResortContactData,
  ResortDiningData,
  ResortEventsData,
  ResortSectionKey,
  ResortSeoData,
  SunviaEcoResortPageData,
} from "@/src/lib/data/sunvia-eco-resort";
import { defaultSunviaEcoResortPageData } from "@/src/lib/data/sunvia-eco-resort";
import IconPicker from "@/src/components/common/IconPicker";

const { TextArea } = Input;

interface SectionEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: ResortSectionKey;
  title: string;
  initialData: SunviaEcoResortPageData[ResortSectionKey];
}

function toCommaText(values?: string[]) {
  return Array.isArray(values) ? values.join(", ") : "";
}

function splitCommaText(value?: string) {
  return (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function prepareInitialValues(section: ResortSectionKey, initialData: SunviaEcoResortPageData[ResortSectionKey]) {
  switch (section) {
    case "seo": {
      const data = initialData as ResortSeoData;
      return {
        ...data,
        metaKeywordsText: toCommaText(data.metaKeywords),
      };
    }
    case "accommodations": {
      const data = initialData as ResortAccommodationData;
      return {
        ...data,
        items: data.items.map((item) => ({
          ...item,
          amenitiesText: toCommaText(item.amenities),
        })),
      };
    }
    case "dining": {
      const data = initialData as ResortDiningData;
      return {
        ...data,
        cuisinesText: toCommaText(data.cuisines),
      };
    }
    case "events": {
      const data = initialData as ResortEventsData;
      return {
        ...data,
        servicesText: toCommaText(data.services),
      };
    }
    case "contact": {
      const data = initialData as ResortContactData;
      return {
        ...data,
        phonesText: toCommaText(data.phones),
        emailsText: toCommaText(data.emails),
        audienceText: toCommaText(data.audience),
      };
    }
    default:
      return initialData;
  }
}

function normalizePayload(section: ResortSectionKey, values: Record<string, unknown>) {
  switch (section) {
    case "seo":
      return {
        metaTitle: values.metaTitle,
        metaDescription: values.metaDescription,
        metaImage: values.metaImage,
        metaKeywords: splitCommaText(values.metaKeywordsText as string),
      };
    case "accommodations":
      return {
        eyebrow: values.eyebrow,
        titlePrefix: values.titlePrefix,
        titleAccent: values.titleAccent,
        description: values.description,
        items: Array.isArray(values.items)
          ? values.items.map((item) => ({
            ...(item as Record<string, unknown>),
            amenities: splitCommaText((item as Record<string, string>).amenitiesText),
          }))
          : [],
      };
    case "dining":
      return {
        eyebrow: values.eyebrow,
        titlePrefix: values.titlePrefix,
        titleAccent: values.titleAccent,
        description: values.description,
        cuisines: splitCommaText(values.cuisinesText as string),
        experiences: values.experiences,
      };
    case "events":
      return {
        badgeText: values.badgeText,
        titlePrefix: values.titlePrefix,
        titleAccent: values.titleAccent,
        description: values.description,
        image: values.image,
        maxCapacity: Number(values.maxCapacity),
        services: splitCommaText(values.servicesText as string),
      };
    case "contact":
      return {
        eyebrow: values.eyebrow,
        titlePrefix: values.titlePrefix,
        titleAccent: values.titleAccent,
        description: values.description,
        checkIn: values.checkIn,
        checkOut: values.checkOut,
        phones: splitCommaText(values.phonesText as string),
        emails: splitCommaText(values.emailsText as string),
        locationFull: values.locationFull,
        audience: splitCommaText(values.audienceText as string),
        ctaText: values.ctaText,
        ctaHref: values.ctaHref,
        note: values.note,
      };
    default:
      return values;
  }
}

function UploadField({
  form,
  name,
  label,
  extra,
}: {
  form: ReturnType<typeof Form.useForm>[0];
  name: string | number | Array<string | number>;
  label: string;
  extra?: string;
}) {
  const imageUrl = Form.useWatch(name, form);

  return (
    <Form.Item label={label} extra={extra}>
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
                form.setFieldValue(name, url);
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

function GalleryImageField({
  form,
  name,
}: {
  form: ReturnType<typeof Form.useForm>[0];
  name: number;
}) {
  const imageUrl = Form.useWatch(["items", name, "src"], form);

  return (
    <Form.Item label="Image">
      <div className="flex flex-col gap-4">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-base-300 bg-base-200/40">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={`Gallery preview ${name + 1}`} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-base-content/50">
              No image selected
            </div>
          )}
        </div>

        <Space.Compact style={{ width: "100%" }}>
          <Form.Item name={[name, "src"]} noStyle>
            <Input placeholder="Image URL" aria-label={`Gallery image URL ${name + 1}`} />
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
                form.setFieldValue(["items", name, "src"], url);
                message.success(`${info.file.name} uploaded successfully`);
              }
            } else if (info.file.status === "error") {
              message.error(`${info.file.name} upload failed.`);
            }
          }}
        >
          <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>
      </div>
    </Form.Item>
  );
}

function AccommodationImageField({
  form,
  name,
}: {
  form: ReturnType<typeof Form.useForm>[0];
  name: number;
}) {
  const imageUrl = Form.useWatch(["items", name, "image"], form);

  return (
    <Form.Item label="Room Image">
      <div className="flex flex-col gap-4">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-base-300 bg-base-200/40">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={`Room preview ${name + 1}`} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-base-content/50">
              No room image selected
            </div>
          )}
        </div>

        <Space.Compact style={{ width: "100%" }}>
          <Form.Item name={[name, "image"]} noStyle>
            <Input placeholder="Room image URL" aria-label={`Room image URL ${name + 1}`} />
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
                form.setFieldValue(["items", name, "image"], url);
                message.success(`${info.file.name} uploaded successfully`);
              }
            } else if (info.file.status === "error") {
              message.error(`${info.file.name} upload failed.`);
            }
          }}
        >
          <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>
      </div>
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
  const router = useRouter();
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);

  const defaultData = useMemo(() => defaultSunviaEcoResortPageData[section], [section]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    form.setFieldsValue(prepareInitialValues(section, initialData ?? defaultData));
  }, [defaultData, form, initialData, isOpen, section]);

  const handleSave = async (values: Record<string, unknown>) => {
    setIsSaving(true);

    try {
      const payload = normalizePayload(section, values);

      const response = await fetch("/api/sunvia-eco-resort", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data: payload }),
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
      console.error("Error saving Sunvia Eco Resort section:", error);
      message.error("Error saving changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const handleSaveClick = () => {
    handleSave(form.getFieldsValue(true));
  };

  const renderSectionFields = () => {
    switch (section) {
      case "seo":
        return (
          <>
            <Form.Item
              label="Meta Title"
              name="metaTitle"
              rules={[{ required: true, message: "Enter a meta title" }]}
            >
              <Input maxLength={70} placeholder="SEO title for this resort page" />
            </Form.Item>
            <Form.Item
              label="Meta Description"
              name="metaDescription"
              rules={[{ required: true, message: "Enter a meta description" }]}
            >
              <TextArea rows={4} maxLength={170} placeholder="Search engine description" />
            </Form.Item>
            <Form.Item
              label="SEO Keywords"
              name="metaKeywordsText"
              extra="Separate keywords with commas."
              rules={[{ required: true, message: "Enter at least one keyword" }]}
            >
              <Input placeholder="Sunvia Eco Resort, Manikganj Resort, Eco Resort Bangladesh" />
            </Form.Item>
            <UploadField
              form={form}
              name="metaImage"
              label="Social Share Image"
              extra="Used for Open Graph and Twitter previews."
            />
          </>
        );

      case "hero":
        return (
          <>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label="Badge Text" name="badgeText" rules={[{ required: true }]}>
                  <Input placeholder="5-Star Eco-Luxury" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Location Text" name="locationText" rules={[{ required: true }]}>
                  <Input placeholder="Manikganj, 1 Hour from Dhaka" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label="Title Part 1" name="titlePart1" rules={[{ required: true }]}>
                  <Input placeholder="SUNVIA" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Title Part 2" name="titlePart2" rules={[{ required: true }]}>
                  <Input placeholder="ECO RESORT" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Subtitle" name="subtitle" rules={[{ required: true }]}>
              <Input placeholder="Where Nature Meets Luxury" />
            </Form.Item>
            <Form.Item label="Description" name="description" rules={[{ required: true }]}>
              <TextArea rows={4} placeholder="Hero description" />
            </Form.Item>
            <Divider>Hero Stats</Divider>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item label="Stat 1 Value" name="stat1Value" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Stat 1 Label" name="stat1Label" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="Stat 2 Value" name="stat2Value" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Stat 2 Label" name="stat2Label" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="Stat 3 Value" name="stat3Value" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Stat 3 Label" name="stat3Label" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Divider>Calls to Action</Divider>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label="Primary CTA Text" name="ctaPrimaryText" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Primary CTA Link" name="ctaPrimaryHref" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label="Secondary CTA Text" name="ctaSecondaryText" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Secondary CTA Link" name="ctaSecondaryHref" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <UploadField form={form} name="backgroundImage" label="Hero Background Image" />
          </>
        );

      case "about":
        return (
          <>
            <Form.Item label="Badge Text" name="badgeText" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Heading" name="heading" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Description" name="description" rules={[{ required: true }]}>
              <TextArea rows={5} />
            </Form.Item>
            <Form.Item label="Floating Badge Text" name="floatingBadgeText" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <UploadField form={form} name="image" label="About Image" />
            <Divider>Highlights</Divider>
            <Form.List name="highlights">
              {(fields, { add, remove }) => (
                <div className="flex flex-col gap-3">
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} align="baseline" className="flex w-full">
                      <Form.Item
                        {...restField}
                        name={[name, "label"]}
                        className="mb-0 grow"
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="Label" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "value"]}
                        className="mb-0 grow"
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="Value" />
                      </Form.Item>
                      <Button danger type="text" icon={<DeleteOutlined />} onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Add Highlight
                  </Button>
                </div>
              )}
            </Form.List>
          </>
        );

      case "accommodations":
        return (
          <>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item label="Eyebrow" name="eyebrow" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="Title Prefix" name="titlePrefix" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="Title Accent" name="titleAccent" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Section Description" name="description" rules={[{ required: true }]}>
              <TextArea rows={4} />
            </Form.Item>
            <Divider>Accommodation Items</Divider>
            <Form.List name="items">
              {(fields, { add, remove }) => (
                <div className="flex flex-col gap-6">
                  <Row gutter={[16, 16]}>
                    {fields.map(({ key, name }) => (
                      <Col xs={24} lg={12} key={key}>
                        <div className="h-full rounded-xl border border-base-300 bg-base-100 p-4">
                          <div className="mb-4 flex items-center justify-between gap-3">
                            <strong>Room #{name + 1}</strong>
                            <Button danger type="text" icon={<DeleteOutlined />} onClick={() => remove(name)} />
                          </div>
                          <Form.Item name={[name, "type"]} label="Room Type" rules={[{ required: true }]}>
                            <Input placeholder="Deluxe Villa" aria-label={`Room type ${name + 1}`} />
                          </Form.Item>
                          <AccommodationImageField form={form} name={name} />
                          <Form.Item
                            name={[name, "description"]}
                            label="Description"
                            rules={[{ required: true }]}
                          >
                            <TextArea rows={3} placeholder="Room description" aria-label={`Room description ${name + 1}`} />
                          </Form.Item>
                          <Form.Item
                            name={[name, "amenitiesText"]}
                            label="Amenities"
                            extra="Separate amenities with commas."
                            rules={[{ required: true }]}
                          >
                            <Input placeholder="Private deck, Lake view, King bed" aria-label={`Room amenities ${name + 1}`} />
                          </Form.Item>
                        </div>
                      </Col>
                    ))}
                  </Row>
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Add Accommodation
                  </Button>
                </div>
              )}
            </Form.List>
          </>
        );

      case "dining":
        return (
          <>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item label="Eyebrow" name="eyebrow" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="Title Prefix" name="titlePrefix" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="Title Accent" name="titleAccent" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Description" name="description" rules={[{ required: true }]}>
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              label="Cuisine Tags"
              name="cuisinesText"
              extra="Separate cuisine names with commas."
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Divider>Dining Experiences</Divider>
            <Form.List name="experiences">
              {(fields, { add, remove }) => (
                <div className="flex flex-col gap-6">
                  {fields.map(({ key, name }) => (
                    <div key={key} className="rounded-xl border border-base-300 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <strong>Experience #{name + 1}</strong>
                        <Button danger type="text" icon={<DeleteOutlined />} onClick={() => remove(name)} />
                      </div>
                      <Form.Item name={[name, "name"]} label="Experience Name" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                      <Form.Item name={[name, "description"]} label="Description" rules={[{ required: true }]}>
                        <TextArea rows={3} />
                      </Form.Item>
                      <UploadField form={form} name={["experiences", name, "image"]} label="Experience Image" />
                    </div>
                  ))}
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Add Experience
                  </Button>
                </div>
              )}
            </Form.List>
          </>
        );

      case "activities":
        return (
          <>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item label="Eyebrow" name="eyebrow" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="Title Prefix" name="titlePrefix" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="Title Accent" name="titleAccent" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Description" name="description" rules={[{ required: true }]}>
              <TextArea rows={4} />
            </Form.Item>
            <Divider>Activities</Divider>
            <Form.List name="items">
              {(fields, { add, remove }) => (
                <div className="flex flex-col gap-3">
                  {fields.map(({ key, name }) => (
                    <Space key={key} align="baseline" className="flex w-full">
                      <Form.Item name={[name, "name"]} className="mb-0 grow" rules={[{ required: true }]}>
                        <Input placeholder="Activity name" />
                      </Form.Item>
                      <Form.Item name={[name, "icon"]} className="mb-0 min-w-40" rules={[{ required: true }]}>
                        <IconPicker placeholder="Select activity icon" />
                      </Form.Item>
                      <Button danger type="text" icon={<DeleteOutlined />} onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add({ icon: defaultSunviaEcoResortPageData.activities.items[0]?.icon })}
                    icon={<PlusOutlined />}
                  >
                    Add Activity
                  </Button>
                </div>
              )}
            </Form.List>
          </>
        );

      case "eco":
        return (
          <>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label="Badge Text" name="badgeText" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Floating Badge Text" name="floatingBadgeText" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label="Title Prefix" name="titlePrefix" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Title Accent" name="titleAccent" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Description" name="description" rules={[{ required: true }]}>
              <TextArea rows={5} />
            </Form.Item>
            <UploadField form={form} name="image" label="Eco Section Image" />
            <Divider>Eco Features</Divider>
            <Form.List name="features">
              {(fields, { add, remove }) => (
                <div className="flex flex-col gap-3">
                  {fields.map(({ key, name }) => (
                    <div key={key} className="rounded-xl border border-base-300 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <strong>Feature #{name + 1}</strong>
                        <Button danger type="text" icon={<DeleteOutlined />} onClick={() => remove(name)} />
                      </div>
                      <Form.Item name={[name, "title"]} label="Title" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                      <Form.Item name={[name, "description"]} label="Description" rules={[{ required: true }]}>
                        <TextArea rows={3} />
                      </Form.Item>
                    </div>
                  ))}
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Add Feature
                  </Button>
                </div>
              )}
            </Form.List>
          </>
        );

      case "events":
        return (
          <>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label="Badge Text" name="badgeText" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item label="Title Prefix" name="titlePrefix" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item label="Title Accent" name="titleAccent" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Description" name="description" rules={[{ required: true }]}>
              <TextArea rows={4} />
            </Form.Item>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <UploadField form={form} name="image" label="Events Image" />
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Max Capacity" name="maxCapacity" rules={[{ required: true }]}>
                  <InputNumber min={1} max={50000} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                  label="Event Services"
                  name="servicesText"
                  extra="Separate services with commas."
                  rules={[{ required: true }]}
                >
                  <TextArea rows={5} />
                </Form.Item>
              </Col>
            </Row>
          </>
        );

      case "gallery":
        return (
          <>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item label="Eyebrow" name="eyebrow" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="Title Prefix" name="titlePrefix" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="Title Accent" name="titleAccent" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Description" name="description">
              <TextArea rows={3} />
            </Form.Item>
            <Divider>Gallery Images</Divider>
            <Form.List name="items">
              {(fields, { add, remove }) => (
                <div className="flex flex-col gap-6">
                  <Row gutter={[16, 16]}>
                    {fields.map(({ key, name }) => (
                      <Col xs={24} md={12} xl={8} key={key}>
                        <div className="h-full rounded-xl border border-base-300 bg-base-100 p-4">
                          <div className="mb-4 flex items-center justify-between gap-3">
                            <strong>Gallery Image #{name + 1}</strong>
                            <Button danger type="text" icon={<DeleteOutlined />} onClick={() => remove(name)} />
                          </div>
                          <GalleryImageField form={form} name={name} />
                          <Form.Item
                            name={[name, "alt"]}
                            label="Alt Text"
                            rules={[{ required: true }]}
                          >
                            <Input placeholder="Describe this image" aria-label={`Gallery image alt text ${name + 1}`} />
                          </Form.Item>
                        </div>
                      </Col>
                    ))}
                  </Row>
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Add Gallery Image
                  </Button>
                </div>
              )}
            </Form.List>
          </>
        );

      case "services":
        return (
          <>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item label="Eyebrow" name="eyebrow" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="Title Prefix" name="titlePrefix" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="Title Accent" name="titleAccent" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Description" name="description" rules={[{ required: true }]}>
              <TextArea rows={4} />
            </Form.Item>
            <Form.List name="items">
              {(fields, { add, remove }) => (
                <div className="flex flex-col gap-3">
                  {fields.map(({ key, name }) => (
                    <Space key={key} align="baseline" className="flex w-full">
                      <Form.Item name={[name, "name"]} className="mb-0 grow" rules={[{ required: true }]}>
                        <Input placeholder="Service name" />
                      </Form.Item>
                      <Form.Item name={[name, "icon"]} className="mb-0 min-w-40" rules={[{ required: true }]}>
                        <IconPicker placeholder="Select service icon" />
                      </Form.Item>
                      <Button danger type="text" icon={<DeleteOutlined />} onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add({ icon: defaultSunviaEcoResortPageData.services.items[0]?.icon })}
                    icon={<PlusOutlined />}
                  >
                    Add Service
                  </Button>
                </div>
              )}
            </Form.List>
          </>
        );

      case "contact":
        return (
          <>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item label="Eyebrow" name="eyebrow" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="Title Prefix" name="titlePrefix" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="Title Accent" name="titleAccent" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Description" name="description" rules={[{ required: true }]}>
              <TextArea rows={4} />
            </Form.Item>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label="Check In" name="checkIn" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Check Out" name="checkOut" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Location" name="locationFull" rules={[{ required: true }]}>
              <TextArea rows={2} />
            </Form.Item>
            <Form.Item
              label="Phone Numbers"
              name="phonesText"
              extra="Separate phone numbers with commas."
              rules={[{ required: true }]}
            >
              <TextArea rows={2} />
            </Form.Item>
            <Form.Item
              label="Emails"
              name="emailsText"
              extra="Separate email addresses with commas."
              rules={[{ required: true }]}
            >
              <TextArea rows={2} />
            </Form.Item>
            <Form.Item
              label="Target Audience"
              name="audienceText"
              extra="Separate audience labels with commas."
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label="CTA Text" name="ctaText" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="CTA Link" name="ctaHref" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Footnote" name="note">
              <Input />
            </Form.Item>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Modal title={`${title}`} open={isOpen} onCancel={handleCancel} width={960} footer={null}>
      <Form form={form} layout="vertical" requiredMark={false}>
        {renderSectionFields()}

        <Form.Item className="mb-0 mt-8">
          <div className="flex justify-end gap-2">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" onClick={handleSaveClick} loading={isSaving} icon={<SaveOutlined />}>
              Save Changes
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
