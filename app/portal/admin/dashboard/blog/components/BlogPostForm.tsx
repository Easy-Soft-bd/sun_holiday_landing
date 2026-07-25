"use client";

import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  Space,
  Spin,
  Typography,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs, { type Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import RichTextEditor from "@/src/components/common/RichTextEditor";
import { slugifyText } from "@/src/lib/tours/slugify-text";
import { uploadImage } from "@/app/portal/admin/dashboard/tours/add/components/upload-image";

const { Text } = Typography;
const { TextArea } = Input;

const CATEGORY_OPTIONS = [
  "Travel Tips",
  "Hajj & Umrah",
  "International",
  "Visa Guide",
  "Resorts",
  "Domestic",
];

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;

type BlogFormValues = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  image: string;
  content: string;
  status: "Draft" | "Active" | "Inactive";
  publishedAt?: Dayjs | null;
  metaTitle?: string;
  metaDescription?: string;
};

const INITIAL_VALUES: Partial<BlogFormValues> = {
  status: "Draft",
  category: "Travel Tips",
};

const cardClass = "!rounded-2xl border border-slate-200/90 bg-white shadow-sm shadow-slate-900/5";
const cardHeadClass = "!border-b !border-slate-100 !py-4 !px-6";
const cardBodyClass = "!px-6 !pb-6 !pt-2";

type BlogPostFormProps = {
  postId?: string;
};

export default function BlogPostForm({ postId }: BlogPostFormProps) {
  const [form] = Form.useForm<BlogFormValues>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [bootLoading, setBootLoading] = useState(Boolean(postId));
  const slugTouchedRef = useRef(false);
  const [slugHint, setSlugHint] = useState<"idle" | "checking" | "ok" | "taken">("idle");
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const isEdit = Boolean(postId);
  const title = Form.useWatch("title", form);
  const slug = Form.useWatch("slug", form);

  useEffect(() => {
    if (!postId) {
      setBootLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setBootLoading(true);
      try {
        const res = await fetch(`/api/blog/${postId}`);
        if (!res.ok) {
          message.error("Failed to load post");
          return;
        }
        const raw = (await res.json()) as Record<string, unknown>;
        if (!cancelled) {
          slugTouchedRef.current = true;
          form.setFieldsValue({
            title: String(raw.title ?? ""),
            slug: String(raw.slug ?? ""),
            excerpt: String(raw.excerpt ?? ""),
            category: String(raw.category ?? "Travel Tips"),
            image: String(raw.image ?? ""),
            content: String(raw.content ?? ""),
            status:
              raw.status === "Active" || raw.status === "Inactive" || raw.status === "Draft"
                ? raw.status
                : "Draft",
            publishedAt: raw.publishedAt ? dayjs(String(raw.publishedAt)) : null,
            metaTitle: raw.metaTitle ? String(raw.metaTitle) : "",
            metaDescription: raw.metaDescription ? String(raw.metaDescription) : "",
          });
        }
      } catch {
        message.error("Failed to load post");
      } finally {
        if (!cancelled) setBootLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [postId, form]);

  useEffect(() => {
    if (isEdit || slugTouchedRef.current) return;
    const t = typeof title === "string" ? title : "";
    if (!t.trim()) {
      form.setFieldValue("slug", "");
      return;
    }
    form.setFieldValue("slug", slugifyText(t));
  }, [title, isEdit, form]);

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
      if (postId) params.set("excludeId", postId);

      void (async () => {
        try {
          const res = await fetch(`/api/blog/slug-available?${params.toString()}`, {
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
  }, [slug, postId, form]);

  const onFinish = async (values: BlogFormValues) => {
    setLoading(true);
    try {
      const payload = {
        title: values.title,
        slug: values.slug,
        excerpt: values.excerpt,
        category: values.category,
        image: values.image,
        content: values.content,
        status: values.status,
        publishedAt: values.publishedAt ? values.publishedAt.toISOString() : null,
        metaTitle: values.metaTitle?.trim() || null,
        metaDescription: values.metaDescription?.trim() || null,
      };

      const url = isEdit ? `/api/blog/${postId}` : "/api/blog";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = (await response.json().catch(() => null)) as { error?: string } | null;
        message.error(err?.error || (isEdit ? "Failed to update post" : "Failed to create post"));
        return;
      }

      message.success(isEdit ? "Post updated successfully" : "Post created successfully");
      router.push("/portal/admin/dashboard/blog");
    } catch (error) {
      console.error("Error saving post:", error);
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
          <p className="text-sm text-slate-500">Loading post…</p>
        </div>
      ) : (
        <>
          <Card
            title="Post details"
            className={cardClass}
            classNames={{ header: cardHeadClass, body: cardBodyClass }}
          >
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Please enter a title" }]}
            >
              <Input placeholder="Post title" size="large" className="!rounded-lg" />
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
                    : "Used in /blog/your-slug — keep it short and descriptive."
              }
              validateStatus={slugHint === "taken" ? "error" : slugHint === "ok" ? "success" : undefined}
            >
              <Space.Compact className="w-full">
                <Input
                  size="large"
                  value="/blog/"
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
                    placeholder="url-friendly-slug"
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
              label="Excerpt"
              rules={[{ required: true, message: "Please enter an excerpt" }]}
              help="Shown on the blog listing and as the default meta description."
            >
              <TextArea rows={3} placeholder="Short summary for cards and SEO…" className="!rounded-lg" />
            </Form.Item>

            <div className="grid gap-4 sm:grid-cols-2">
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: "Please choose a category" }]}
              >
                <Select
                  size="large"
                  showSearch
                  allowClear={false}
                  options={CATEGORY_OPTIONS.map((c) => ({ value: c, label: c }))}
                  placeholder="Select category"
                />
              </Form.Item>

              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true }]}
              >
                <Select size="large">
                  <Select.Option value="Draft">Draft</Select.Option>
                  <Select.Option value="Active">Active (published)</Select.Option>
                  <Select.Option value="Inactive">Inactive</Select.Option>
                </Select>
              </Form.Item>
            </div>

            <Form.Item
              name="publishedAt"
              label="Publish date"
              help="Used for display date and SEO article timestamps. Defaults to now when first published."
            >
              <DatePicker showTime className="w-full" size="large" />
            </Form.Item>
          </Card>

          <Card
            title="Cover & content"
            className={`${cardClass} mt-6`}
            classNames={{ header: cardHeadClass, body: cardBodyClass }}
          >
            <Form.Item label="Cover image" required help="Upload an image or paste a URL">
              <Space orientation="vertical" className="w-full">
                <Upload
                  maxCount={1}
                  listType="picture-card"
                  beforeUpload={async (file) => {
                    try {
                      const url = await uploadImage(file as File, "blog");
                      form.setFieldValue("image", url);
                      message.success("Image uploaded successfully");
                    } catch {
                      message.error("Failed to upload image");
                    }
                    return false;
                  }}
                >
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
                <Form.Item
                  name="image"
                  rules={[{ required: true, message: "Please upload or enter image URL" }]}
                  noStyle
                >
                  <Input placeholder="Or paste image URL here" size="large" className="!rounded-lg" />
                </Form.Item>
              </Space>
            </Form.Item>

            <Form.Item
              name="content"
              label="Content"
              rules={[{ required: true, message: "Please write the article content" }]}
              help="Formatting in the editor matches what visitors will see."
            >
              <RichTextEditor placeholder="Write your travel story…" enableHeadings />
            </Form.Item>
          </Card>

          <Card
            title="SEO (optional)"
            className={`${cardClass} mt-6`}
            classNames={{ header: cardHeadClass, body: cardBodyClass }}
          >
            <Text type="secondary" className="mb-4 block text-sm">
              Leave blank to use the post title and excerpt. Overrides apply to the page title, Open Graph, and Twitter cards.
            </Text>
            <Form.Item name="metaTitle" label="Meta title">
              <Input placeholder="Custom SEO title" size="large" className="!rounded-lg" maxLength={70} showCount />
            </Form.Item>
            <Form.Item name="metaDescription" label="Meta description">
              <TextArea
                rows={3}
                placeholder="Custom SEO description (≈155 characters)"
                className="!rounded-lg"
                maxLength={160}
                showCount
              />
            </Form.Item>
          </Card>

          <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
            <Button size="large" onClick={() => router.push("/portal/admin/dashboard/blog")}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" size="large" loading={loading}>
              {isEdit ? "Save changes" : "Create post"}
            </Button>
          </div>
        </>
      )}
    </Form>
  );
}
