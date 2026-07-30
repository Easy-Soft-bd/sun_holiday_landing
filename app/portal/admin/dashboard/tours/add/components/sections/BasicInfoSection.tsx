"use client";

import { Button, Checkbox, Form, Input, InputNumber, Select, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { slugifyText } from "@/src/lib/tours/slugify-text";
import LocationSelectField from "../LocationSelectField";

const { Option } = Select;
const { Text } = Typography;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;

type SlugCheckResponse = {
  available: boolean;
  normalized: string;
  suggestion: string | null;
};

type BasicInfoSectionProps = {
  /** When set, that tour id is ignored when checking slug collisions (edit mode). */
  tourId?: string;
  /** New tours: keep slug in sync with title until the user edits the slug field. */
  autoSlugFromTitle?: boolean;
};

export default function BasicInfoSection({ tourId, autoSlugFromTitle = true }: BasicInfoSectionProps) {
  const form = Form.useFormInstance();
  const title = Form.useWatch("title", form);
  const slug = Form.useWatch("slug", form);
  const showOnHome = Form.useWatch("showOnHome", form);
  const slugTouchedRef = useRef(false);
  const [slugHint, setSlugHint] = useState<"idle" | "checking" | "ok" | "taken">("idle");
  const [suggestion, setSuggestion] = useState<string | null>(null);

  useEffect(() => {
    if (!autoSlugFromTitle || slugTouchedRef.current) {
      return;
    }
    const t = typeof title === "string" ? title : "";
    if (!t.trim()) {
      form.setFieldValue("slug", "");
      return;
    }
    form.setFieldValue("slug", slugifyText(t));
  }, [title, autoSlugFromTitle, form]);

  useEffect(() => {
    const s = typeof slug === "string" ? slug.trim() : "";
    if (!s) {
      setSlugHint("idle");
      setSuggestion(null);
      return;
    }
    if (!SLUG_PATTERN.test(s)) {
      setSlugHint("idle");
      setSuggestion(null);
      return;
    }

    setSlugHint("checking");
    let cancelled = false;
    const handle = window.setTimeout(() => {
      const params = new URLSearchParams({
        slug: s,
        title: (form.getFieldValue("title") as string) || s,
      });
      if (tourId) {
        params.set("excludeId", tourId);
      }

      void (async () => {
        try {
          const res = await fetch(`/api/tours/slug-available?${params.toString()}`, {
            credentials: "same-origin",
          });
          if (cancelled) {
            return;
          }
          if (!res.ok) {
            setSlugHint("idle");
            setSuggestion(null);
            return;
          }
          const data = (await res.json()) as SlugCheckResponse;
          if (cancelled) {
            return;
          }
          if (data.available) {
            setSlugHint("ok");
            setSuggestion(null);
          } else {
            setSlugHint("taken");
            setSuggestion(data.suggestion);
          }
        } catch {
          if (!cancelled) {
            setSlugHint("idle");
            setSuggestion(null);
          }
        }
      })();
    }, 380);

    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [slug, tourId, form]);

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
      <Form.Item name="title" label="Tour Title" rules={[{ required: true, message: "Please enter tour title" }]}>
        <Input placeholder="e.g. Cox's Bazar Beach Paradise" size="large" className="!rounded-lg" />
      </Form.Item>

      <Form.Item
        name="slug"
        label="URL slug"
        tooltip="Used in the public link: /tours/your-slug. On new tours it follows the title until you edit it here."
        rules={[
          {
            validator: async (_, value) => {
              const s = typeof value === "string" ? value.trim() : "";
              if (!s) {
                return;
              }
              if (!SLUG_PATTERN.test(s)) {
                throw new Error("Use letters, numbers, and hyphens only");
              }
            },
          },
          {
            validator: async (_, value) => {
              const s = typeof value === "string" ? value.trim() : "";
              if (!s) {
                return;
              }
              if (!SLUG_PATTERN.test(s)) {
                return;
              }
              const params = new URLSearchParams({
                slug: s,
                title: (form.getFieldValue("title") as string) || s,
              });
              if (tourId) {
                params.set("excludeId", tourId);
              }
              const res = await fetch(`/api/tours/slug-available?${params.toString()}`, {
                credentials: "same-origin",
              });
              if (!res.ok) {
                throw new Error("Could not verify slug. Try again.");
              }
              const data = (await res.json()) as SlugCheckResponse;
              if (!data.available) {
                throw new Error(
                  data.suggestion ? `Already in use. Try “${data.suggestion}” or pick another slug.` : "This slug is already in use."
                );
              }
            },
          },
        ]}
        extra={
          <div className="mt-1 min-h-[22px] space-y-1">
            {slugHint === "checking" ? (
              <Text type="secondary" className="text-xs">
                Checking availability…
              </Text>
            ) : null}
            {slugHint === "ok" ? (
              <Text className="text-xs text-emerald-600">
                This slug is available.
              </Text>
            ) : null}
            {slugHint === "taken" ? (
              <div className="flex flex-wrap items-center gap-2">
                <Text type="danger" className="text-xs">
                  Already used by another tour.
                </Text>
                {suggestion ? (
                  <Button
                    type="link"
                    size="small"
                    className="!h-auto !p-0 text-xs"
                    onClick={() => {
                      form.setFieldValue("slug", suggestion);
                      slugTouchedRef.current = true;
                    }}
                  >
                    Use “{suggestion}”
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        }
      >
        <Input
          placeholder="e.g. cox-bazar-beach-paradise"
          size="large"
          className="!rounded-lg"
          allowClear
          onChange={(e) => {
            slugTouchedRef.current = true;
            const v = e.target.value;
            if (!v?.trim() && autoSlugFromTitle) {
              slugTouchedRef.current = false;
            }
          }}
        />
      </Form.Item>

      <LocationSelectField />

      <Form.Item name="category" label="Category" rules={[{ required: true, message: "Please select category" }]}>
        <Select size="large">
          <Option value="International">International</Option>
          <Option value="Domestic">Domestic</Option>
          <Option value="Hajj & Umrah">Hajj & Umrah</Option>
        </Select>
      </Form.Item>

      <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please select status" }]}>
        <Select size="large">
          <Option value="Draft">Draft</Option>
          <Option value="Active">Active</Option>
          <Option value="Inactive">Inactive</Option>
        </Select>
      </Form.Item>

      <Form.Item name="price" label="Price (BDT)" rules={[{ required: true, message: "Please enter price" }]}>
        <InputNumber<number>
          className="!w-full !rounded-lg"
          size="large"
          formatter={(value) => `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          parser={(value) => Number(value?.replace(/\৳\s?|(,*)/g, "") || 0)}
          min={0}
        />
      </Form.Item>

      <Form.Item name="duration" label="Duration" rules={[{ required: true, message: "Please enter duration" }]}>
        <Input placeholder="e.g. 3 Days / 2 Nights" size="large" className="!rounded-lg" />
      </Form.Item>

      <Form.Item
        name="showOnHome"
        label="Home page"
        valuePropName="checked"
        tooltip="When checked, this Active tour appears in the Popular Tour Packages slider on the home page."
        className="md:col-span-2"
      >
        <Checkbox>Show in Popular Tour Packages slider</Checkbox>
      </Form.Item>

      <Form.Item
        name="homeSortOrder"
        label="Home slider order"
        tooltip="Lower numbers appear first in the home page slider."
        extra="Only used when the tour is shown on the home page."
      >
        <InputNumber<number>
          className="!w-full !rounded-lg"
          size="large"
          min={0}
          step={1}
          precision={0}
          disabled={!showOnHome}
          placeholder="0"
        />
      </Form.Item>
    </div>
  );
}
