"use client";

import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";

type StringListFieldProps = {
  name: string;
  label: string;
  placeholder: string;
  addButtonText: string;
};

export default function StringListField({ name, label, placeholder, addButtonText }: StringListFieldProps) {
  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <Form.Item label={label}>
          <div className="space-y-2">
            {fields.map(({ key, name: fieldName, ...restField }) => (
              <div key={key} className="flex gap-2">
                <Form.Item
                  {...restField}
                  name={[fieldName]}
                  className="mb-0 flex-1"
                  rules={[{ required: true, message: `Missing ${label.toLowerCase()} item` }]}
                >
                  <Input placeholder={placeholder} size="large" className="!rounded-lg" />
                </Form.Item>
                <Button
                  type="text"
                  danger
                  size="large"
                  icon={<MinusCircleOutlined />}
                  aria-label="Remove row"
                  onClick={() => remove(fieldName)}
                  className="!self-start shrink-0"
                />
              </div>
            ))}
            <Button type="dashed" onClick={() => add()} block size="large" icon={<PlusOutlined />} className="!rounded-xl">
              {addButtonText}
            </Button>
          </div>
        </Form.Item>
      )}
    </Form.List>
  );
}
