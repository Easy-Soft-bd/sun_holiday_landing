"use client";

import { UploadOutlined } from "@ant-design/icons";
import { Upload, message } from "antd";
import type { FormInstance } from "antd";
import StringListField from "../StringListField";
import type { TourFormValues } from "../types";
import { uploadImage } from "../upload-image";

type GallerySectionProps = {
  form: FormInstance<TourFormValues>;
};

export default function GallerySection({ form }: GallerySectionProps) {
  return (
    <>
      <p className="mb-4 text-sm leading-relaxed text-slate-600">
        Upload images or add URLs below. The first gallery image is also used in compact grids if needed.
      </p>
      <Upload
        multiple
        listType="picture-card"
        beforeUpload={async (file) => {
          try {
            const url = await uploadImage(file as File, "tour");
            const currentGallery = form.getFieldValue("gallery") || [];
            form.setFieldValue("gallery", [...currentGallery, url]);
            message.success("Image uploaded successfully");
          } catch {
            message.error("Failed to upload image");
          }

          return false;
        }}
      >
        <div>
          <UploadOutlined />
          <div style={{ marginTop: 8 }}>Upload Gallery Images</div>
        </div>
      </Upload>

      <div className="mt-4">
        <StringListField
          name="gallery"
          label="Gallery Image URLs"
          placeholder="Image URL"
          addButtonText="Add URL Manually"
        />
      </div>
    </>
  );
}
