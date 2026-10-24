"use client";

import {
  App,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  Space,
  Spin,
  Typography,
} from "antd";
import LoadingUpload from "@/src/components/common/LoadingUpload";
import { UploadOutlined } from "@ant-design/icons";
import dayjs, { type Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import RichTextEditor from "@/src/components/common/RichTextEditor";
import { slugifyText } from "@/src/lib/tours/slugify-text";
import { uploadImage } from "@/app/portal/admin/dashboard/tours/add/components/upload-image";

const { Text } = Typography;
const { TextArea } = Input;

const CATEGORY_OPTIONS = ["News", "Event", "Blog", "CSR"] as const;

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
  eventDate?: Dayjs | null;
  eventLocation?: string;
  metaTitle?: string;
  metaDescription?: string;
};

const CATEGORY_HINTS: Record<(typeof CATEGORY_OPTIONS)[number], string> = {
  News: "Announcements",
  Event: "Date and place",
  Blog: "Stories",
  CSR: "Community",
};

const INITIAL_VALUES: Partial<BlogFormValues> = {
  status: "Draft",
  category: "Blog",
};

const cardClass = "!rounded-2xl !border !border-base-300 !bg-base-100 shadow-sm";
const cardHeadClass = "!border-b !border-base-300 !bg-base-100 !py-4 !px-6";
const cardBodyClass = "!bg-base-100 !px-6 !pb-6 !pt-4";

type BlogPostFormProps = {
  postId?: string;
};

export default function BlogPostForm({ postId }: BlogPostFormProps) {
  const { message } = App.useApp();
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
  const categoryValue = Form.useWatch("category", form);
  const imageValue = Form.useWatch("image", form);
  const isEvent = categoryValue === "Event";
  const categoryOptions = Array.from(
    new Set<string>([...CATEGORY_OPTIONS, ...(categoryValue ? [categoryValue] : [])]),
  );

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
            category: String(raw.category ?? "Blog"),
            image: String(raw.image ?? ""),
            content: String(raw.content ?? ""),
            status:
              raw.status === "Active" || raw.status === "Inactive" || raw.status === "Draft"
                ? raw.status
                : "Draft",
            publishedAt: raw.publishedAt ? dayjs(String(raw.publishedAt)) : null,
            eventDate: raw.eventDate ? dayjs(String(raw.eventDate).slice(0, 10)) : null,
            eventLocation: raw.eventLocation ? String(raw.eventLocation) : "",
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
        eventDate: values.category === "Event" && values.eventDate ? values.eventDate.format("YYYY-MM-DD") : null,
        eventLocation: values.category === "Event" ? values.eventLocation?.trim() || null : null,
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
        <div className="grid w-full items-start gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="flex flex-col gap-8">
            <Card
              title="Story"
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
                help="Shown on listing cards and used as the default search description."
              >
                <TextArea rows={3} placeholder="Short summary for cards and search…" className="!rounded-lg" />
              </Form.Item>

              <Form.Item
                name="content"
                label="Content"
                rules={[{ required: true, message: "Please write the article content" }]}
              >
                <RichTextEditor
                  variant="full"
                  placeholder="Write the article…"
                  uploadImage={(file) => uploadImage(file, "blog")}
                />
              </Form.Item>
            </Card>

            <Card
              title="Search snippet"
              className={cardClass}
              classNames={{ header: cardHeadClass, body: cardBodyClass }}
            >
              <Text type="secondary" className="mb-4 block text-sm">
                Optional. Leave blank to use the title and excerpt.
              </Text>
              <Form.Item name="metaTitle" label="Meta title">
                <Input placeholder="Custom search title" size="large" className="!rounded-lg" maxLength={70} showCount />
              </Form.Item>
              <Form.Item name="metaDescription" label="Meta description">
                <TextArea
                  rows={3}
                  placeholder="Custom search description"
                  className="!rounded-lg"
                  maxLength={160}
                  showCount
                />
              </Form.Item>
            </Card>
          </div>

          <aside className="flex flex-col gap-8 lg:sticky lg:top-4">
            <Card
              title="Publishing"
              className={cardClass}
              classNames={{ header: cardHeadClass, body: cardBodyClass }}
            >
              <div className="mb-2 text-sm text-slate-700">Category</div>
              <div className="mb-2 grid grid-cols-2 gap-2">
                {categoryOptions.map((option) => {
                  const selected = categoryValue === option;
                  const hint = CATEGORY_HINTS[option as (typeof CATEGORY_OPTIONS)[number]];
                  return (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => form.setFieldValue("category", option)}
                      className={`rounded-xl border px-3 py-2.5 text-left transition-colors ${
                        selected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-base-300 bg-base-100 text-base-content hover:border-primary/40"
                      }`}
                    >
                      <span className="block text-sm font-semibold">{option}</span>
                      {hint ? <span className="mt-0.5 block text-xs font-normal text-slate-500">{hint}</span> : null}
                    </button>
                  );
                })}
              </div>
              <Form.Item
                name="category"
                className="!mb-3"
                rules={[{ required: true, message: "Please choose a category" }]}
              >
                <input type="hidden" />
              </Form.Item>

              <div className={isEvent ? "mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3" : "hidden"}>
                <p className="mb-3 text-sm font-semibold text-amber-950">Event details</p>
                <Form.Item
                  name="eventDate"
                  label="Event date"
                  rules={isEvent ? [{ required: true, message: "Choose the event date" }] : []}
                >
                  <DatePicker className="w-full" size="large" format="MMM D, YYYY" />
                </Form.Item>
                <Form.Item
                  name="eventLocation"
                  label="Location"
                  className="!mb-0"
                  rules={isEvent ? [{ required: true, message: "Enter the event location" }] : []}
                >
                  <Input placeholder="Venue, city" size="large" className="!rounded-lg" maxLength={200} />
                </Form.Item>
              </div>

              <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                <Select size="large">
                  <Select.Option value="Draft">Draft</Select.Option>
                  <Select.Option value="Active">Active</Select.Option>
                  <Select.Option value="Inactive">Inactive</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="publishedAt"
                label="Publish date"
                className="!mb-0"
                help="When the story goes live. Defaults to now the first time it is Active."
              >
                <DatePicker showTime className="w-full" size="large" />
              </Form.Item>
            </Card>

            <Card
              title="Cover"
              className={cardClass}
              classNames={{ header: cardHeadClass, body: cardBodyClass }}
            >
              {imageValue ? (
                <img
                  src={imageValue}
                  alt=""
                  className="mb-3 h-36 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="mb-3 flex h-36 items-center justify-center rounded-xl border border-dashed border-base-300 bg-base-200 text-sm text-base-content/50">
                  No cover yet
                </div>
              )}
              <LoadingUpload
                maxCount={1}
                showUploadList={false}
                beforeUpload={async (file) => {
                  try {
                    const url = await uploadImage(file as File, "blog");
                    form.setFieldValue("image", url);
                    message.success("Image uploaded");
                  } catch {
                    message.error("Failed to upload image");
                  }
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />} className="mb-3">
                  Upload image
                </Button>
              </LoadingUpload>
              <Form.Item
                name="image"
                className="!mb-0"
                rules={[{ required: true, message: "Please upload or enter an image URL" }]}
              >
                <Input placeholder="Or paste an image URL" size="large" className="!rounded-lg" />
              </Form.Item>
            </Card>

            <div className="flex flex-col gap-2">
              <Button type="primary" htmlType="submit" size="large" loading={loading} block>
                {isEdit ? "Save changes" : "Create post"}
              </Button>
              <Button size="large" block onClick={() => router.push("/portal/admin/dashboard/blog")}>
                Cancel
              </Button>
            </div>
          </aside>
        </div>
      )}
    </Form>
  );
}
