"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { App, Button, Card, Form, Input, InputNumber, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { uploadImage } from "@/app/portal/admin/dashboard/tours/add/components/upload-image";

type TicketRouteFormProps = {
  routeId?: string;
};

type FormValues = {
  from: string;
  to: string;
  airline?: string;
  priceFrom?: number | null;
  image?: string;
  note?: string;
  status: "Active" | "Inactive";
  sortOrder: number;
};

const cardClass = "shadow-sm";

export default function TicketRouteForm({ routeId }: TicketRouteFormProps) {
  const { message } = App.useApp();
  const router = useRouter();
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(Boolean(routeId));
  const imageValue = Form.useWatch("image", form);
  const isEdit = Boolean(routeId);

  useEffect(() => {
    if (!routeId) return;
    let cancelled = false;

    (async () => {
      setFetching(true);
      try {
        const response = await fetch(`/api/ticket-routes/${routeId}`);
        if (!response.ok) throw new Error("Missing route");
        const data = (await response.json()) as FormValues;
        if (cancelled) return;
        form.setFieldsValue({
          from: data.from,
          to: data.to,
          airline: data.airline || "",
          priceFrom: data.priceFrom ?? null,
          image: data.image || "",
          note: data.note || "",
          status: data.status || "Active",
          sortOrder: data.sortOrder ?? 0,
        });
      } catch {
        if (!cancelled) message.error("Could not load this route");
      } finally {
        if (!cancelled) setFetching(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [form, message, routeId]);

  const onFinish = async (values: FormValues) => {
    setLoading(true);
    try {
      const payload = {
        from: values.from.trim(),
        to: values.to.trim(),
        airline: values.airline?.trim() || null,
        priceFrom: values.priceFrom == null ? null : values.priceFrom,
        image: values.image?.trim() || null,
        note: values.note?.trim() || null,
        status: values.status,
        sortOrder: values.sortOrder ?? 0,
      };
      const response = await fetch(isEdit ? `/api/ticket-routes/${routeId}` : "/api/ticket-routes", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(data?.error || "Save failed");
      message.success(isEdit ? "Route updated" : "Route created");
      router.push("/portal/admin/dashboard/tickets");
      router.refresh();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Could not save this route");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark="optional"
      disabled={fetching}
      initialValues={{ status: "Active", sortOrder: 0 }}
      onFinish={(values) => void onFinish(values)}
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"
    >
      <div className="space-y-6">
        <Card title="Route" className={cardClass}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Form.Item name="from" label="Departure" rules={[{ required: true, message: "Enter the departure city" }]}>
              <Input size="large" placeholder="Dhaka" />
            </Form.Item>
            <Form.Item name="to" label="Destination" rules={[{ required: true, message: "Enter the destination" }]}>
              <Input size="large" placeholder="USA" />
            </Form.Item>
          </div>
          <Form.Item name="airline" label="Airline">
            <Input size="large" placeholder="Optional, shown on the card" />
          </Form.Item>
          <Form.Item name="note" label="Note" className="!mb-0">
            <Input.TextArea rows={3} placeholder="Optional short line for the card, such as a typical travel time" />
          </Form.Item>
        </Card>

        <Card title="Card image" className={cardClass}>
          {imageValue ? (
            <img src={imageValue} alt="" className="mb-3 h-40 w-full rounded-xl object-cover" />
          ) : (
            <div className="mb-3 flex h-40 items-center justify-center rounded-xl border border-dashed border-base-300 bg-base-200 text-sm text-base-content/50">
              No image yet
            </div>
          )}
          <Upload
            maxCount={1}
            showUploadList={false}
            accept="image/jpeg,image/png,image/webp,image/gif"
            beforeUpload={async (file) => {
              try {
                const url = await uploadImage(file as File, "ticket");
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
          </Upload>
          <Form.Item name="image" className="!mb-0" label="Image URL">
            <Input size="large" placeholder="Or paste an image URL" />
          </Form.Item>
        </Card>
      </div>

      <aside className="space-y-6">
        <Card title="Publishing" className={cardClass}>
          <Form.Item name="priceFrom" label="Starting price (BDT)">
            <InputNumber min={0} size="large" className="!w-full" placeholder="Leave empty to hide the price" />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select size="large">
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="sortOrder" label="Sort order" className="!mb-0" help="Lower numbers appear first.">
            <InputNumber min={0} size="large" className="!w-full" />
          </Form.Item>
        </Card>

        <div className="flex flex-col gap-2">
          <Button type="primary" htmlType="submit" size="large" loading={loading} block>
            {isEdit ? "Save changes" : "Create route"}
          </Button>
          <Button size="large" block onClick={() => router.push("/portal/admin/dashboard/tickets")}>
            Cancel
          </Button>
        </div>
      </aside>
    </Form>
  );
}
