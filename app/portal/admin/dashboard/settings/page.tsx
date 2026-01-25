"use client";

import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Typography, Space, Divider, message, Tabs, Skeleton, Upload, GetProp, UploadProps } from 'antd';
import {
  GlobalOutlined,
  ContactsOutlined,
  ShareAltOutlined,
  SearchOutlined,
  SaveOutlined,
  UploadOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '@/src/lib/redux/api/settingsApi';
import { useUploadFileMutation } from '@/src/lib/redux/api/uploadApi';

const { Title, Text } = Typography;
const { TextArea } = Input;

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/svg+xml';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG/SVG files!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

export default function SettingsPage() {
  const [form] = Form.useForm();
  const { data: settingsData, isLoading, isError } = useGetSettingsQuery({});
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();
  const [uploadFile, { isLoading: isUploadingFile }] = useUploadFileMutation();

  const [logoLoading, setLogoLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>();
  const [metaLoading, setMetaLoading] = useState(false);
  const [metaUrl, setMetaUrl] = useState<string>();

  useEffect(() => {
    if (settingsData?.data) {
      form.setFieldsValue(settingsData.data);
      setLogoUrl(settingsData.data.siteLogo);
      setMetaUrl(settingsData.data.metaImage);
    }
  }, [settingsData, form]);

  const handleUpload = async (file: FileType, type: 'logo' | 'meta') => {
    const setLoader = type === 'logo' ? setLogoLoading : setMetaLoading;
    const setUrl = type === 'logo' ? setLogoUrl : setMetaUrl;
    const fieldName = type === 'logo' ? 'siteLogo' : 'metaImage';

    setLoader(true);
    const formData = new FormData();
    formData.append('file', file);
    if (type === 'logo') {
      formData.append('type', 'logo');
    }

    try {
      const response = await uploadFile(formData).unwrap();
      if (response.success) {
        setUrl(response.url);
        form.setFieldValue(fieldName, response.url);
        message.success(`${type === 'logo' ? 'Logo' : 'Meta image'} uploaded successfully`);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      message.error('Upload failed');
    } finally {
      setLoader(false);
    }
  };

  const uploadButton = (loading: boolean) => (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const onFinish = async (values: any) => {
    try {
      await updateSettings(values).unwrap();
      message.success('Settings updated successfully');
    } catch (error) {
      console.error('Failed to update settings:', error);
      message.error('Failed to update settings');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <Title level={4} type="danger">Error loading settings</Title>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const tabItems = [
    {
      key: '1',
      label: (
        <span>
          <GlobalOutlined /> General Info
        </span>
      ),
      children: (
        <Card bordered={false} className="shadow-sm">
          <Space direction="vertical" size="large" className="w-full">
            <Form.Item
              label="Site Name"
              name="siteName"
              rules={[{ required: true, message: 'Please enter site name' }]}
            >
              <Input placeholder="Sun Holidays" />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Form.Item label="Main Logo" name="siteLogo" extra="Recommended size: 200x50px. Max 2MB.">
                <Upload
                  name="siteLogo"
                  listType="picture-card"
                  className="logo-upload"
                  showUploadList={false}
                  action=""
                  beforeUpload={(file) => {
                    handleUpload(file, 'logo');
                    return false; // Prevent auto-upload
                  }}
                >
                  {logoUrl ? <img src={logoUrl} alt="logo" style={{ width: '100%' }} /> : uploadButton(logoLoading)}
                </Upload>
                <Input value={logoUrl} onChange={(e) => {
                    setLogoUrl(e.target.value);
                    form.setFieldValue('siteLogo', e.target.value);
                }} placeholder="Or enter URL manually" className="mt-2" />
              </Form.Item>

              <Form.Item
                label="Meta Image (SEO)"
                name="metaImage"
                extra="Shared on social media. 1200x630px recommended."
              >
                <Upload
                  name="metaImage"
                  listType="picture-card"
                  className="meta-upload"
                  showUploadList={false}
                  action=""
                  beforeUpload={(file) => {
                    handleUpload(file, 'meta');
                    return false;
                  }}
                >
                  {metaUrl ? <img src={metaUrl} alt="meta" style={{ width: '100%' }} /> : uploadButton(metaLoading)}
                </Upload>
                <Input value={metaUrl} onChange={(e) => {
                    setMetaUrl(e.target.value);
                    form.setFieldValue('metaImage', e.target.value);
                }} placeholder="Or enter URL manually" className="mt-2" />
              </Form.Item>
            </div>
          </Space>
        </Card>
      ),
    },
    {
      key: '2',
      label: (
        <span>
          <ContactsOutlined /> Contact Details
        </span>
      ),
      children: (
        <Card bordered={false} className="shadow-sm">
          <Space direction="vertical" size="large" className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item label="Contact Email" name="contactEmail">
                <Input placeholder="info@sunholidaysltd.com" />
              </Form.Item>
              <Form.Item label="Contact Phone" name="contactPhone">
                <Input placeholder="+880 1234 567890" />
              </Form.Item>
            </div>

            <Form.Item label="Office Address" name="address">
              <TextArea rows={4} placeholder="Enter full office address" />
            </Form.Item>
          </Space>
        </Card>
      ),
    },
    {
      key: '3',
      label: (
        <span>
          <ShareAltOutlined /> Social Links
        </span>
      ),
      children: (
        <Card bordered={false} className="shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="Facebook URL" name="facebookUrl">
              <Input placeholder="https://facebook.com/sunholidays" />
            </Form.Item>
            <Form.Item label="Twitter URL" name="twitterUrl">
              <Input placeholder="https://twitter.com/sunholidays" />
            </Form.Item>
            <Form.Item label="Instagram URL" name="instagramUrl">
              <Input placeholder="https://instagram.com/sunholidays" />
            </Form.Item>
            <Form.Item label="LinkedIn URL" name="linkedinUrl">
              <Input placeholder="https://linkedin.com/company/sunholidays" />
            </Form.Item>
          </div>
        </Card>
      ),
    },
    {
      key: '4',
      label: (
        <span>
          <SearchOutlined /> SEO Settings
        </span>
      ),
      children: (
        <Card bordered={false} className="shadow-sm">
          <Space direction="vertical" size="large" className="w-full">
            <Form.Item
              label="Meta Title"
              name="metaTitle"
              extra="The title displayed in browser tabs and search results"
            >
              <Input placeholder="Sun Holidays - Your Gateway to the World" />
            </Form.Item>

            <Form.Item label="Meta Description" name="metaDescription">
              <TextArea rows={4} placeholder="Enter a brief description of your website for search engines" />
            </Form.Item>

            <Form.Item label="Meta Keywords" name="metaKeywords" extra="Separate keywords with commas">
              <Input placeholder="travel, holidays, flights, visa" />
            </Form.Item>
          </Space>
        </Card>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <Title level={2} style={{ margin: 0 }}>
            General Settings
          </Title>
          <Text type="secondary">Manage your website's global information and configuration</Text>
        </div>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          size="large"
          loading={isUpdating}
          onClick={() => form.submit()}
        >
          Save Changes
        </Button>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
        <Tabs defaultActiveKey="1" className="settings-tabs" items={tabItems} />
      </Form>
    </div>
  );
}
