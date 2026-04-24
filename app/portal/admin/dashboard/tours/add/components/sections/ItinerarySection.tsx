"use client";

import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber } from "antd";
import RichTextEditor from "../RichTextEditor";

export default function ItinerarySection() {
  return (
    <Form.List name="itinerary">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <div
              key={key}
              className="mb-4 flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-slate-50/40 p-4 sm:flex-row sm:items-start"
            >
              <Form.Item
                {...restField}
                name={[name, "day"]}
                label="Day"
                className="mb-0 w-full sm:w-24"
                rules={[{ required: true, message: "Missing day" }]}
              >
                <InputNumber min={1} className="!w-full" size="large" />
              </Form.Item>

              <div className="min-w-0 flex-1 space-y-1">
                <Form.Item
                  {...restField}
                  name={[name, "title"]}
                  label="Title"
                  rules={[{ required: true, message: "Missing title" }]}
                >
                  <Input placeholder="Day title" size="large" className="!rounded-lg" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "description"]}
                  label="Description"
                  rules={[{ required: true, message: "Missing description" }]}
                  className="mb-0"
                >
                  <RichTextEditor placeholder="Activities, meals, and notes for this day…" />
                </Form.Item>
              </div>

              <Button
                type="text"
                danger
                icon={<MinusCircleOutlined />}
                aria-label="Remove day"
                onClick={() => remove(name)}
                className="!self-end sm:!mt-8 sm:!self-start"
              />
            </div>
          ))}

          <Form.Item className="mb-0">
            <Button type="dashed" onClick={() => add()} block size="large" icon={<PlusOutlined />} className="!rounded-xl">
              Add itinerary day
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
}
