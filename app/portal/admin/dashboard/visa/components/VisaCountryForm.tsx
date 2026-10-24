"use client";

import {
  App,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Spin,
  Typography,
} from "antd";
import LoadingUpload from "@/src/components/common/LoadingUpload";
import { UploadOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import RichTextEditor from "@/src/components/common/RichTextEditor";
import { slugifyText } from "@/src/lib/tours/slugify-text";
import { uploadImage } from "@/app/portal/admin/dashboard/tours/add/components/upload-image";

const { Text } = Typography;
const { TextArea } = Input;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;

type VisaFormValues = {
  name: string;
  slug: string;
  excerpt: string;
  content: string;
  status: "Draft" | "Active" | "Inactive";
  sortOrder: number;
  flagImage?: string;
  flagEmoji?: string;
  coverImage: string;
  metaTitle?: string;
  metaDescription?: string;
};

const INITIAL_VALUES: Partial<VisaFormValues> = {
  status: "Draft",
  sortOrder: 0,
};

const cardClass = "!rounded-2xl !border !border-base-300 !bg-base-100 shadow-sm";
const cardHeadClass = "!border-b !border-base-300 !bg-base-100 !py-4 !px-6";
const cardBodyClass = "!bg-base-100 !px-6 !pb-6 !pt-4";

type VisaCountryFormProps = {
  countryId?: string;
};

export default function VisaCountryForm({ countryId }: VisaCountryFormProps) {
  const { message } = App.useApp();
  const [form] = Form.useForm<VisaFormValues>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [bootLoading, setBootLoading] = useState(Boolean(countryId));
  const slugTouchedRef = useRef(false);
  const [slugHint, setSlugHint] = useState<"idle" | "checking" | "ok" | "taken">("idle");
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const isEdit = Boolean(countryId);
  const name = Form.useWatch("name", form);
  const slug = Form.useWatch("slug", form);
  const coverValue = Form.useWatch("coverImage", form);
  const flagImageValue = Form.useWatch("flagImage", form);
  const flagEmojiValue = Form.useWatch("flagEmoji", form);

  useEffect(() => {
    if (!countryId) {
      setBootLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setBootLoading(true);
      try {
        const res = await fetch(`/api/visa/${countryId}`);
        if (!res.ok) {
          message.error("Failed to load country");
          return;
        }
        const raw = (await res.json()) as Record<string, unknown>;
        if (!cancelled) {
          slugTouchedRef.current = true;
          form.setFieldsValue({
            name: String(raw.name ?? ""),
            slug: String(raw.slug ?? ""),
            excerpt: String(raw.excerpt ?? ""),
            content: String(raw.content ?? ""),
            status:
              raw.status === "Active" || raw.status === "Inactive" || raw.status === "Draft"
                ? raw.status
                : "Draft",
            sortOrder: Number(raw.sortOrder ?? 0),
            flagImage: raw.flagImage ? String(raw.flagImage) : "",
            flagEmoji: raw.flagEmoji ? String(raw.flagEmoji) : "",
            coverImage: String(raw.coverImage ?? ""),
            metaTitle: raw.metaTitle ? String(raw.metaTitle) : "",
            metaDescription: raw.metaDescription ? String(raw.metaDescription) : "",
          });
        }
      } catch {
        message.error("Failed to load country");
      } finally {
        if (!cancelled) setBootLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [countryId, form, message]);

  useEffect(() => {
    if (isEdit || slugTouchedRef.current) return;
    const nextName = typeof name === "string" ? name : "";
    if (!nextName.trim()) {
      form.setFieldValue("slug", "");
      return;
    }
    form.setFieldValue("slug", slugifyText(nextName));
  }, [name, isEdit, form]);

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
        name: (form.getFieldValue("name") as string) || s,
      });
      if (countryId) params.set("excludeId", countryId);

      void (async () => {
        try {
          const res = await fetch(`/api/visa/slug-available?${params.toString()}`, {
            credentials: "same-origin",
          });
          if (cancelled) return;
          if (!res.ok) {
            setSlugHint("idle");
            setSuggestion(null);
            return;
          }
          const data = (await res.json()) as {
            available: boolean;
            suggestion: string | null;
          };
          setSlugHint(data.available ? "ok" : "taken");
          setSuggestion(data.suggestion);
        } catch {
          if (!cancelled) {
            setSlugHint("idle");
            setSuggestion(null);
          }
        }
      })();
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [slug, countryId, form]);

  const onFinish = async (values: VisaFormValues) => {
    if (slugHint === "taken") {
      message.error("Choose an available URL slug");
      return;
    }
    if (!values.flagImage?.trim() && !values.flagEmoji?.trim()) {
      message.error("Upload a flag image or enter a flag emoji");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: values.name,
        slug: values.slug,
        excerpt: values.excerpt,
        content: values.content,
        status: values.status,
        sortOrder: values.sortOrder ?? 0,
        flagImage: values.flagImage?.trim() || null,
        flagEmoji: values.flagEmoji?.trim() || null,
        coverImage: values.coverImage,
        metaTitle: values.metaTitle?.trim() || null,
        metaDescription: values.metaDescription?.trim() || null,
      };

      const url = isEdit ? `/api/visa/${countryId}` : "/api/visa";
      const method = isEdit ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = (await response.json().catch(() => null)) as { error?: string } | null;
        message.error(err?.error || (isEdit ? "Failed to update country" : "Failed to create country"));
        return;
      }

      message.success(isEdit ? "Country updated" : "Country created");
      router.push("/portal/admin/dashboard/visa");
    } catch (error) {
      console.error("Error saving visa country:", error);
      message.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} initialValues={INITIAL_VALUES} requiredMark="optional">
      {bootLoading ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
          <Spin size="large" />
          <p className="text-sm text-slate-500">Loading country…</p>
        </div>
      ) : (
        <div className="grid w-full items-start gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="flex flex-col gap-8">
            <Card title="Country" className={cardClass} classNames={{ header: cardHeadClass, body: cardBodyClass }}>
              <Form.Item
                name="name"
                label="Country name"
                rules={[{ required: true, message: "Please enter the country name" }]}
              >
                <Input placeholder="United Kingdom" size="large" className="!rounded-lg" />
              </Form.Item>

              <Form.Item
                label="URL slug"
                required
                help={
                  slugHint === "taken"
                    ? suggestion
                      ? `Slug is taken. Try “${suggestion}”.`
                      : "Slug is already in use."
                    : slugHint === "ok"
                      ? "Slug is available."
                      : "Public page: /visa/your-slug"
                }
                validateStatus={slugHint === "taken" ? "error" : slugHint === "ok" ? "success" : undefined}
              >
                <Space.Compact className="w-full">
                  <Input
                    size="large"
                    value="/visa/"
                    disabled
                    className="!w-auto !min-w-[4.5rem] !rounded-lg !bg-slate-50 !text-slate-500"
                  />
                  <Form.Item
                    name="slug"
                    noStyle
                    rules={[
                      { required: true, message: "Please enter a slug" },
                      {
                        pattern: SLUG_PATTERN,
                        message: "Use lowercase letters, numbers, and hyphens only",
                      },
                    ]}
                  >
                    <Input
                      placeholder="united-kingdom"
                      size="large"
                      className="!rounded-lg font-mono"
                      onChange={() => {
                        slugTouchedRef.current = true;
                      }}
                    />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>

              <Form.Item
                name="excerpt"
                label="Short summary"
                rules={[{ required: true, message: "Please enter a short summary" }]}
                help="Shown on country cards and used when the meta description is left blank."
              >
                <TextArea rows={3} placeholder="Who this visa is for, in one or two sentences." className="!rounded-lg" />
              </Form.Item>

              <Form.Item
                name="content"
                label="Visa information"
                rules={[{ required: true, message: "Please write the visa information" }]}
                help="Procedures, eligibility, required documents, fees, and any other guidance for applicants."
              >
                <RichTextEditor
                  variant="full"
                  placeholder="Write the visa requirements, documents, and application steps…"
                  uploadImage={(file) => uploadImage(file, "visa")}
                />
              </Form.Item>
            </Card>

            <Card
              title="Search snippet"
              className={cardClass}
              classNames={{ header: cardHeadClass, body: cardBodyClass }}
            >
              <Text type="secondary" className="mb-4 block text-sm">
                Optional. Leave blank to use “Country Visa Assistance” and the short summary.
              </Text>
              <Form.Item name="metaTitle" label="Meta title">
                <Input placeholder="United Kingdom Visa Assistance" size="large" className="!rounded-lg" maxLength={70} showCount />
              </Form.Item>
              <Form.Item name="metaDescription" label="Meta description">
                <TextArea
                  rows={3}
                  placeholder="What someone should see in Google results"
                  className="!rounded-lg"
                  maxLength={160}
                  showCount
                />
              </Form.Item>
            </Card>
          </div>

          <aside className="flex flex-col gap-8 lg:sticky lg:top-4">
            <Card title="Publishing" className={cardClass} classNames={{ header: cardHeadClass, body: cardBodyClass }}>
              <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                <Select size="large">
                  <Select.Option value="Draft">Draft</Select.Option>
                  <Select.Option value="Active">Active</Select.Option>
                  <Select.Option value="Inactive">Inactive</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="sortOrder"
                label="Sort order"
                className="!mb-0"
                help="Lower numbers appear first on the Visa page and homepage."
              >
                <InputNumber min={0} size="large" className="!w-full" />
              </Form.Item>
            </Card>

            <Card title="Flag" className={cardClass} classNames={{ header: cardHeadClass, body: cardBodyClass }}>
              <div className="mb-3 flex h-16 items-center gap-3">
                {flagImageValue ? (
                  <img src={flagImageValue} alt="" className="h-10 w-14 rounded-md object-cover" />
                ) : (
                  <span className="flex h-10 w-14 items-center justify-center rounded-md border border-dashed border-base-300 text-2xl">
                    {flagEmojiValue || "🏳️"}
                  </span>
                )}
                <Text type="secondary" className="text-sm">
                  Upload a flag, or use an emoji until you have one.
                </Text>
              </div>
              <LoadingUpload
                maxCount={1}
                showUploadList={false}
                accept="image/jpeg,image/png,image/webp,image/gif"
                beforeUpload={async (file) => {
                  try {
                    const url = await uploadImage(file as File, "visa");
                    form.setFieldValue("flagImage", url);
                    message.success("Flag uploaded");
                  } catch {
                    message.error("Failed to upload flag");
                  }
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />} className="mb-3">
                  Upload flag
                </Button>
              </LoadingUpload>
              <Form.Item name="flagImage" label="Flag image URL">
                <Input placeholder="Or paste a flag image URL" size="large" className="!rounded-lg" />
              </Form.Item>
              <Form.Item name="flagEmoji" label="Flag emoji" className="!mb-0">
                <Input placeholder="🇬🇧" size="large" maxLength={16} className="!rounded-lg" />
              </Form.Item>
            </Card>

            <Card title="Cover" className={cardClass} classNames={{ header: cardHeadClass, body: cardBodyClass }}>
              {coverValue ? (
                <img src={coverValue} alt="" className="mb-3 h-36 w-full rounded-xl object-cover" />
              ) : (
                <div className="mb-3 flex h-36 items-center justify-center rounded-xl border border-dashed border-base-300 bg-base-200 text-sm text-base-content/50">
                  No cover yet
                </div>
              )}
              <LoadingUpload
                maxCount={1}
                showUploadList={false}
                accept="image/jpeg,image/png,image/webp,image/gif"
                beforeUpload={async (file) => {
                  try {
                    const url = await uploadImage(file as File, "visa");
                    form.setFieldValue("coverImage", url);
                    message.success("Cover uploaded");
                  } catch {
                    message.error("Failed to upload cover");
                  }
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />} className="mb-3">
                  Upload cover
                </Button>
              </LoadingUpload>
              <Form.Item
                name="coverImage"
                className="!mb-0"
                rules={[{ required: true, message: "Please upload or enter a cover image" }]}
              >
                <Input placeholder="Or paste a cover image URL" size="large" className="!rounded-lg" />
              </Form.Item>
            </Card>

            <div className="flex flex-col gap-2">
              <Button type="primary" htmlType="submit" size="large" loading={loading} block>
                {isEdit ? "Save changes" : "Create country"}
              </Button>
              <Button size="large" block onClick={() => router.push("/portal/admin/dashboard/visa")}>
                Cancel
              </Button>
            </div>
          </aside>
        </div>
      )}
    </Form>
  );
}
