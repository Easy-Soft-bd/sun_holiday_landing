"use client";

import { MinusCircleOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { App, Button, Divider, Form, Input, InputNumber, Modal, Space } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ImageUrlUploadField from "@/src/components/common/ImageUrlUploadField";
import IconPicker from "@/src/components/common/IconPicker";
import SailorMoonGalleryImageCell from "@/src/view/sailor-moon-resorts/SailorMoonGalleryImageCell";
import type { SailorMoonResortsPageData } from "@/src/lib/data/sailor-moon-resorts-page";
import { mergeSailorMoonResortsPageData, readSailorMoonPriceHighlights } from "@/src/lib/data/sailor-moon-resorts-page";
import type { ResortPageEditorConfig } from "@/src/view/sailor-moon-resorts/editor-config";

const { TextArea } = Input;

type FormValues = Omit<SailorMoonResortsPageData, "metaKeywords" | "contact" | "bookingCtaHref"> & {
  metaKeywordsText: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<SailorMoonResortsPageData> | null;
  editor?: ResortPageEditorConfig;
};

export default function SailorMoonResortsEditModal({ isOpen, onClose, initialData, editor }: Props) {
  const section = editor?.section ?? "sailor_moon_resorts_page";
  const title = editor?.title ?? "Edit Sailor Moon Resorts page";
  const uploadType = editor?.uploadType ?? "sailor";
  const defaults = editor?.defaults;
  const { message } = App.useApp();
  const router = useRouter();
  const [form] = Form.useForm<FormValues>();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const m = mergeSailorMoonResortsPageData(initialData, defaults);
    const { metaKeywords, contact: _contact, bookingCtaHref: _bookingCtaHref, ...rest } = m;
    form.setFieldsValue({
      ...rest,
      metaKeywordsText: metaKeywords.join(", "),
    });
  }, [isOpen, initialData, form, defaults]);

  const handleSave = async (values: FormValues) => {
    setIsSaving(true);
    try {
      const existing = mergeSailorMoonResortsPageData(initialData, defaults);
      const { metaKeywordsText, ...rest } = values;
      const payload: SailorMoonResortsPageData = {
        ...rest,
        galleryMaxItems: Number(rest.galleryMaxItems) > 0 ? Number(rest.galleryMaxItems) : 12,
        bookingCtaHref: existing.bookingCtaHref,
        metaKeywords: metaKeywordsText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        pricingItems: (rest.pricingItems ?? [])
          .map((item) => ({
            name: String(item?.name ?? "").trim(),
            price: String(item?.price ?? "").trim(),
            unit: String(item?.unit ?? "").trim() || "per night",
            description: String(item?.description ?? "").trim(),
            highlights: readSailorMoonPriceHighlights(item?.highlights),
          }))
          .filter((item) => item.name),
        // Phones and emails on the public page come from Dashboard → Settings.
        contact: existing.contact,
      };

      const response = await fetch("/api/home-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data: payload }),
      });

      if (response.ok) {
        message.success(`${title.replace(/^Edit\s+/i, "")} updated`);
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

  return (
    <Modal
      title={title}
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width={1040}
      styles={{ body: { maxHeight: "85vh", overflowY: "auto", paddingTop: 8 } }}
    >
      <Form form={form} layout="vertical" onFinish={(v) => void handleSave(v as FormValues)} requiredMark={false}>
        <Divider titlePlacement="left">SEO</Divider>
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
          rules={[{ required: true, message: "Enter at least one keyword" }]}
        >
          <Input placeholder="resort, saint martin, …" />
        </Form.Item>
        <Form.Item
          name="metaOgImage"
          label="Social / OG image"
          extra="Upload a file or paste a URL. Hero also uses the first gallery image below."
          rules={[{ required: true, message: "Add an image URL or upload a file" }]}
        >
          <ImageUrlUploadField uploadType={uploadType} placeholder={`/uploads/${uploadType}/… or https://…`} previewHeightClassName="h-28" />
        </Form.Item>

        <Divider titlePlacement="left">Main details</Divider>
        <Form.Item name="name" label="Resort name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="location" label="Full address" rules={[{ required: true }]}>
          <TextArea rows={2} />
        </Form.Item>
        <Form.Item name="description" label="About description" rules={[{ required: true }]}>
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item name="tagline" label="Tagline (under hero title)" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Divider titlePlacement="left">Hero</Divider>
        <Form.Item name="heroBadge" label="Hero badge" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Space.Compact className="w-full">
          <Form.Item className="w-1/2 pr-2" name="heroTitleLine1" label="Title line 1" rules={[{ required: true }]}>
            <Input placeholder="Sailor Moon" />
          </Form.Item>
          <Form.Item className="w-1/2 pl-2" name="heroTitleLine2" label="Title line 2 (accent)" rules={[{ required: true }]}>
            <Input placeholder="Resorts" />
          </Form.Item>
        </Space.Compact>
        <Form.Item name="heroWelcome" label="Welcome line" rules={[{ required: true }]}>
          <TextArea rows={2} />
        </Form.Item>
        <Space.Compact className="w-full">
          <Form.Item className="w-1/2 pr-2" name="heroBookCtaText" label="Primary CTA text" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item className="w-1/2 pl-2" name="heroBookCtaHref" label="Primary CTA link" rules={[{ required: true }]}>
            <Input placeholder="#booking" />
          </Form.Item>
        </Space.Compact>
        <Space.Compact className="w-full">
          <Form.Item className="w-1/2 pr-2" name="heroGalleryCtaText" label="Secondary CTA text" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item className="w-1/2 pl-2" name="heroGalleryCtaHref" label="Secondary CTA link" rules={[{ required: true }]}>
            <Input placeholder="#gallery" />
          </Form.Item>
        </Space.Compact>

        <Divider titlePlacement="left">About highlights</Divider>
        <Form.Item name="aboutEyebrow" label="Eyebrow" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Space.Compact className="w-full">
          <Form.Item className="w-1/2 pr-2" name="aboutHeadingBefore" label="Heading (before accent)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item className="w-1/2 pl-2" name="aboutHeadingAccent" label="Heading accent" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Space.Compact>
        <Space.Compact className="w-full">
          <Form.Item className="w-1/3 pr-1" name="highlight1Title" label="Card 1 title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item className="w-2/3 pl-1" name="highlight1Subtitle" label="Card 1 subtitle" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Space.Compact>
        <Space.Compact className="w-full">
          <Form.Item className="w-1/3 pr-1" name="highlight2Title" label="Card 2 title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item className="w-2/3 pl-1" name="highlight2Subtitle" label="Card 2 subtitle" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Space.Compact>
        <Space.Compact className="w-full">
          <Form.Item className="w-1/3 pr-1" name="highlight3Title" label="Card 3 title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item className="w-2/3 pl-1" name="highlight3Subtitle" label="Card 3 subtitle" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Space.Compact>

        <Divider titlePlacement="left">Facilities section</Divider>
        <Form.Item name="facilitiesEyebrow" label="Eyebrow" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Space.Compact className="w-full">
          <Form.Item className="w-1/2 pr-2" name="facilitiesHeadingBefore" label="Heading (before accent)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item className="w-1/2 pl-2" name="facilitiesHeadingAccent" label="Heading accent" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Space.Compact>

        <Divider titlePlacement="left">Gallery section</Divider>
        <Form.Item name="galleryEyebrow" label="Eyebrow" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Space.Compact className="w-full">
          <Form.Item className="w-1/2 pr-2" name="galleryHeadingBefore" label="Heading (before accent)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item className="w-1/2 pl-2" name="galleryHeadingAccent" label="Heading accent" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Space.Compact>
        <Form.Item name="galleryMaxItems" label="Max gallery images shown" rules={[{ required: true }]}>
          <InputNumber min={1} max={48} className="w-full" />
        </Form.Item>

        <Divider titlePlacement="left">Features</Divider>
        <Form.List name="features">
          {(fields, { add, remove }) => (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50/80 to-white p-4 shadow-sm ring-1 ring-slate-900/5">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Facility {name + 1}</span>
                    <Button type="text" danger size="small" icon={<MinusCircleOutlined />} onClick={() => remove(name)} aria-label="Remove feature" />
                  </div>
                  <Form.Item {...restField} name={[name, "title"]} label="Title" rules={[{ required: true }]} className="mb-3">
                    <Input />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "description"]} label="Description" rules={[{ required: true }]} className="mb-3">
                    <TextArea rows={3} />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "icon"]} label="Icon" rules={[{ required: true, message: "Pick an icon" }]} className="mb-0">
                    <IconPicker placeholder="Search icons…" />
                  </Form.Item>
                </div>
              ))}
              <button
                type="button"
                onClick={() => add({ title: "", description: "", icon: "LuUtensils" })}
                className="group flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 text-sm font-medium text-slate-500 transition hover:border-primary hover:bg-primary/5 hover:text-primary"
              >
                <PlusOutlined className="text-lg transition group-hover:scale-110" />
                Add facility
              </button>
            </div>
          )}
        </Form.List>

        <Divider titlePlacement="left">Gallery</Divider>
        <div className="mb-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 px-4 py-3 text-sm text-slate-600">
          <p className="font-medium text-slate-800">Grid manager</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Reorder with the arrows on each card. The <strong>Hero</strong> slot uses the first image for the page hero and Open Graph unless you override OG above.
            Uploads go to <code className="rounded bg-white px-1 text-[11px]">{`/uploads/${uploadType}`}</code>.
          </p>
        </div>
        <Form.List name="images">
          {(fields, { add, remove, move }) => (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fields.map(({ key, name, ...restField }, index) => (
                <div key={key} className="min-w-0">
                  <Form.Item
                    {...restField}
                    name={[name]}
                    rules={[{ required: true, message: "Add an image URL or upload" }]}
                    className="mb-0"
                    label={null}
                  >
                    <SailorMoonGalleryImageCell
                      uploadType={uploadType}
                      isHero={index === 0}
                      indexDisplay={index + 1}
                      onRemove={() => remove(name)}
                      onMoveUp={index > 0 ? () => move(index, index - 1) : undefined}
                      onMoveDown={index < fields.length - 1 ? () => move(index, index + 1) : undefined}
                    />
                  </Form.Item>
                </div>
              ))}
              <button
                type="button"
                onClick={() => add("")}
                className="group flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-gradient-to-b from-white to-slate-50/80 text-slate-500 shadow-inner transition hover:border-primary hover:bg-primary/[0.04] hover:text-primary"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-400 transition group-hover:bg-primary/15 group-hover:text-primary">
                  <PlusOutlined />
                </span>
                <span className="text-sm font-medium">Add image</span>
                <span className="px-4 text-center text-[11px] text-slate-400">New card appears at the end</span>
              </button>
            </div>
          )}
        </Form.List>

        <Divider titlePlacement="left">Pricing</Divider>
        <Form.Item name="pricingEyebrow" label="Eyebrow" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Space.Compact className="w-full">
          <Form.Item className="w-1/2 pr-2" name="pricingHeadingBefore" label="Heading (before accent)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item className="w-1/2 pl-2" name="pricingHeadingAccent" label="Heading accent" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Space.Compact>
        <Form.Item name="pricingIntro" label="Intro" rules={[{ required: true }]}>
          <TextArea rows={2} />
        </Form.Item>
        <Form.List name="pricingItems">
          {(fields, { add, remove }) => (
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50/80 to-white p-4 shadow-sm ring-1 ring-slate-900/5">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Room {name + 1}</span>
                    <Button type="text" danger size="small" icon={<MinusCircleOutlined />} onClick={() => remove(name)} aria-label="Remove room" />
                  </div>
                  <Form.Item {...restField} name={[name, "name"]} label="Room name" rules={[{ required: true }]} className="mb-3">
                    <Input placeholder="Deluxe Room" />
                  </Form.Item>
                  <Space.Compact className="w-full">
                    <Form.Item {...restField} className="mb-3 w-1/2 pr-2" name={[name, "price"]} label="Price" rules={[{ required: true }]}>
                      <Input placeholder="4,500 or On request" />
                    </Form.Item>
                    <Form.Item {...restField} className="mb-3 w-1/2 pl-2" name={[name, "unit"]} label="Unit" rules={[{ required: true }]}>
                      <Input placeholder="per night" />
                    </Form.Item>
                  </Space.Compact>
                  <Form.Item {...restField} name={[name, "description"]} label="Short line" rules={[{ required: true }]} className="mb-3">
                    <TextArea rows={2} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "highlights"]}
                    label="Bullet list"
                    extra="One point per line"
                    className="mb-0"
                    getValueProps={(value: unknown) => ({
                      value: Array.isArray(value) ? value.join("\n") : String(value ?? ""),
                    })}
                  >
                    <TextArea rows={4} placeholder={"Queen bed\nBeach access\nAir conditioning"} />
                  </Form.Item>
                </div>
              ))}
              <button
                type="button"
                onClick={() => add({ name: "", price: "", unit: "per night", description: "", highlights: [] })}
                className="group flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 text-sm font-medium text-slate-500 transition hover:border-primary hover:bg-primary/5 hover:text-primary"
              >
                <PlusOutlined className="text-lg transition group-hover:scale-110" />
                Add room rate
              </button>
            </div>
          )}
        </Form.List>
        <Form.Item name="pricingDisclaimer" label="Disclaimer under the rates">
          <Input placeholder="*Rates can change by season" />
        </Form.Item>

        <Divider titlePlacement="left">Booking</Divider>
        <p className="mb-4 text-sm leading-relaxed text-slate-500">
          Phone numbers and email addresses on this page come from Dashboard → Settings. The form below is the on-page booking request.
        </p>
        <Form.Item name="bookingEyebrow" label="Eyebrow" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Space.Compact className="w-full">
          <Form.Item className="w-1/2 pr-2" name="bookingHeadingBefore" label="Heading (before accent)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item className="w-1/2 pl-2" name="bookingHeadingAccent" label="Heading accent" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Space.Compact>
        <Form.Item name="bookingIntro" label="Intro line" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Space.Compact className="w-full">
          <Form.Item className="w-1/2 pr-2" name="checkIn" label="Check-in" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item className="w-1/2 pl-2" name="checkOut" label="Check-out" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Space.Compact>
        <Form.Item name="bookingCtaText" label="Submit button text" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="bookingDisclaimer" label="Small disclaimer under the form">
          <Input placeholder="*Conditions apply" />
        </Form.Item>

        <Divider titlePlacement="left">Location section</Divider>
        <Form.Item name="locationEyebrow" label="Eyebrow" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Space.Compact className="w-full">
          <Form.Item className="w-1/2 pr-2" name="locationHeadingBefore" label="Heading (before accent)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item className="w-1/2 pl-2" name="locationHeadingAccent" label="Heading accent" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Space.Compact>
        <Form.Item
          name="googleMapsUrl"
          label="Google Maps link"
          extra="Share link or embed URL. Leave this blank and the map stays hidden."
        >
          <Input placeholder="https://maps.app.goo.gl/... or https://www.google.com/maps/embed?..." />
        </Form.Item>

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
