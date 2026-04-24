"use client";

import { UploadOutlined } from "@ant-design/icons";
import { Form, Input, Space, Upload, message } from "antd";
import type { FormInstance } from "antd";
import RichTextEditor from "../RichTextEditor";
import { uploadImage } from "../upload-image";
import type { TourFormValues } from "../types";

type MediaDescriptionSectionProps = {
  form: FormInstance<TourFormValues>;
};

export default function MediaDescriptionSection({ form }: MediaDescriptionSectionProps) {
  return (
    <>
      <Form.Item label="Main Image" required help="Upload an image or provide a URL">
        <Space orientation="vertical" className="w-full">
          <Upload
            maxCount={1}
            listType="picture-card"
            beforeUpload={async (file) => {
              try {
                const url = await uploadImage(file as File, "tour");
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

      <Form.Item name="videoUrl" label="Video URL (Optional)">
        <Input placeholder="https://youtube.com/..." size="large" className="!rounded-lg" />
      </Form.Item>

      <Form.Item
        name="inquiryPhone"
        label="Inquiry Phone (Optional)"
        help="Phone number solely for this tour inquiries"
      >
        <Input placeholder="+880..." size="large" className="!rounded-lg" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: "Please enter description" }]}
        help="Use the toolbar for bold, italics, lists, and strikethrough. Bullets and numbers appear in the editor as you type."
      >
        <RichTextEditor placeholder="Write the full tour overview for your guests…" />
      </Form.Item>
    </>
  );
}
