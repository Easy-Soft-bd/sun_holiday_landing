"use client";

import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Typography, Space, message, Tabs, Skeleton, Upload } from 'antd';
import type { GetProp, UploadProps } from 'antd';
import {
  GlobalOutlined,
  ContactsOutlined,
  ShareAltOutlined,
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '@/src/lib/redux/api/settingsApi';
import { useUploadFileMutation } from '@/src/lib/redux/api/uploadApi';

const { Title, Text } = Typography;
const { TextArea } = Input;
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export default function SettingsPage() {
  const [form] = Form.useForm();
  const { data: settingsData, isLoading, isError } = useGetSettingsQuery({});
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();
  const [uploadFile] = useUploadFileMutation();
  const [logoLoading, setLogoLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>();

  useEffect(() => {
    if (settingsData?.data) {
      const d = settingsData.data;
      const contactEmails =
        Array.isArray(d.contactEmails) && d.contactEmails.length > 0
          ? d.contactEmails
          : String(d.contactEmail || '')
              .split(/[\n,;]+/)
              .map((v: string) => v.trim())
              .filter(Boolean);
      const contactPhones =
        Array.isArray(d.contactPhones) && d.contactPhones.length > 0
          ? d.contactPhones
          : String(d.contactPhone || '')
              .split(/[\n,;]+/)
              .map((v: string) => v.trim())
              .filter(Boolean);
      form.setFieldsValue({
        ...d,
        contactEmails,
        contactPhones,
      });
      setLogoUrl(d.siteLogo || '');
    }
  }, [settingsData, form]);

  const handleLogoUpload = async (file: FileType) => {
    setLogoLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'logo');
    try {
      const response = await uploadFile(formData).unwrap();
      if (response?.success && response?.url) {
        setLogoUrl(response.url);
        form.setFieldValue('siteLogo', response.url);
        message.success('Logo uploaded successfully');
      } else {
        message.error('Upload failed');
      }
    } catch {
      message.error('Upload failed');
    } finally {
      setLogoLoading(false);
    }
    return false;
  };

  const onFinish = async (values: any) => {
    const contactEmails = (values.contactEmails || []).map((v: string) => String(v).trim()).filter(Boolean);
    const contactPhones = (values.contactPhones || []).map((v: string) => String(v).trim()).filter(Boolean);
    const payload = {
      ...values,
      siteLogo: String(values.siteLogo || '').trim(),
      contactEmails,
      contactPhones,
      // keep single-value compatibility for consumers still using legacy fields
      contactEmail: contactEmails[0] || '',
      contactPhone: contactPhones[0] || '',
    };

    try {
      await updateSettings(payload).unwrap();
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
          <GlobalOutlined /> Global Basic
        </span>
      ),
      children: (
        <Card variant="borderless" className="shadow-sm">
          <Space orientation="vertical" size="large" className="w-full">
            <Form.Item
              label="Site Name"
              name="siteName"
              rules={[{ required: true, message: 'Please enter site name' }]}
            >
              <Input placeholder="Sun Tourism" />
            </Form.Item>
            <Form.Item label="Main Website Logo" extra="Used by navbar and footer brand logo.">
              <Upload
                name="siteLogo"
                listType="picture-card"
                showUploadList={false}
                action=""
                beforeUpload={handleLogoUpload}
              >
                {logoUrl ? (
                  <img src={logoUrl} alt="logo" style={{ width: '100%' }} />
                ) : (
                  <button style={{ border: 0, background: 'none' }} type="button">
                    {logoLoading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </button>
                )}
              </Upload>
              <Form.Item name="siteLogo" noStyle>
                <Input
                  value={logoUrl}
                  onChange={(e) => {
                    setLogoUrl(e.target.value);
                    form.setFieldValue('siteLogo', e.target.value);
                  }}
                  placeholder="Or paste logo URL"
                  className="mt-2"
                />
              </Form.Item>
            </Form.Item>
            <Text type="secondary">
              This page is global source for shared branding, contact, and social data.
              SEO stays page-specific.
            </Text>
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
        <Card variant="borderless" className="shadow-sm">
          <Space orientation="vertical" size="large" className="w-full">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-base-content/50">Email addresses</div>
            <Form.List name="contactEmails">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline" className="w-full max-w-full">
                      <Form.Item
                        {...restField}
                        name={[name]}
                        className="mb-0 flex-1 min-w-0"
                        rules={[{ required: true, message: 'Email required' }, { type: 'email', message: 'Invalid email' }]}
                      >
                        <Input placeholder="info@sunholidaysltd.com" />
                      </Form.Item>
                      <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add('')} block icon={<PlusOutlined />}>
                    Add email
                  </Button>
                </>
              )}
            </Form.List>

            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-base-content/50">Phone numbers</div>
            <Form.List name="contactPhones">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline" className="w-full max-w-full">
                      <Form.Item
                        {...restField}
                        name={[name]}
                        className="mb-0 flex-1 min-w-0"
                        rules={[{ required: true, message: 'Phone required' }]}
                      >
                        <Input placeholder="+880 1234 567890" />
                      </Form.Item>
                      <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add('')} block icon={<PlusOutlined />}>
                    Add phone
                  </Button>
                </>
              )}
            </Form.List>

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
        <Card variant="borderless" className="shadow-sm">
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
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Global Data Source
          </Title>
          <Text type="secondary">Shared contact/social data used across page sections and public layouts.</Text>
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
