"use client";

import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Typography, Space, App, Skeleton, Upload } from 'antd';
import type { GetProp, UploadProps } from 'antd';
import {
  GlobalOutlined,
  ContactsOutlined,
  ShareAltOutlined,
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined,
  LoadingOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '@/src/lib/redux/api/settingsApi';
import { useUploadFileMutation } from '@/src/lib/redux/api/uploadApi';
import IconPicker from '@/src/components/common/IconPicker';
import { DEFAULT_SOCIAL_ICON, SUGGESTED_SOCIAL_LINKS } from '@/src/lib/social-links';

const { Title, Text } = Typography;
const { TextArea } = Input;
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export default function SettingsPage() {
  const { message } = App.useApp();
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
        socialLinks: Array.isArray(d.socialLinks) ? d.socialLinks : [],
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
        // Persist immediately so navbar/footer update without a separate Save click.
        await updateSettings({ siteLogo: response.url }).unwrap();
        message.success('Logo updated on the website');
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
    const socialLinks = (values.socialLinks || [])
      .map((link: { label?: string; icon?: string; url?: string }) => ({
        label: String(link?.label || '').trim(),
        icon: String(link?.icon || '').trim() || DEFAULT_SOCIAL_ICON,
        url: String(link?.url || '').trim(),
      }))
      .filter((link: { url: string }) => link.url.length > 0);
    const payload = {
      ...values,
      siteLogo: String(values.siteLogo || logoUrl || '').trim(),
      address: String(values.address || '').trim(),
      googleMapsUrl: String(values.googleMapsUrl || '').trim(),
      contactEmails,
      contactPhones,
      socialLinks,
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

  const sectionClass = "rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm md:p-8";

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold tracking-[0.24em] text-primary uppercase">Brand and contact</p>
          <Title level={2} className="!mb-2 !font-gilliequest !text-4xl !tracking-tight">
            Global settings
          </Title>
          <Text type="secondary">
            The name, logo, contact details, and social links used across the public site.
          </Text>
        </div>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          size="large"
          loading={isUpdating}
          onClick={() => form.submit()}
          className="rounded-full"
        >
          Save changes
        </Button>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false} className="space-y-6">
        <section className={sectionClass}>
          <div className="mb-6">
            <Title level={4} className="!mb-1">
              <GlobalOutlined className="mr-2 text-primary" />
              Brand
            </Title>
            <Text type="secondary">Site name and the logo shown in the navbar and footer.</Text>
          </div>
          <Form.Item
            label="Site name"
            name="siteName"
            rules={[{ required: true, message: 'Please enter site name' }]}
          >
            <Input placeholder="Sun Tourism" />
          </Form.Item>
          <Form.Item label="Website logo" extra="Uploading saves immediately and updates the navbar and footer.">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-28 w-full items-center justify-center overflow-hidden rounded-2xl border border-base-300 bg-base-200 sm:w-56">
                {logoUrl ? (
                  <img src={logoUrl} alt="Current website logo" className="max-h-20 max-w-[85%] object-contain" />
                ) : (
                  <span className="text-sm text-base-content/50">No logo yet</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Upload
                  name="siteLogo"
                  showUploadList={false}
                  beforeUpload={handleLogoUpload}
                >
                  <Button icon={logoLoading ? <LoadingOutlined /> : <PlusOutlined />} loading={logoLoading}>
                    Upload logo
                  </Button>
                </Upload>
                <Form.Item name="siteLogo" noStyle>
                  <Input
                    value={logoUrl}
                    onChange={(e) => {
                      setLogoUrl(e.target.value);
                      form.setFieldValue('siteLogo', e.target.value);
                    }}
                    placeholder="Or paste a logo URL"
                    className="mt-3"
                  />
                </Form.Item>
              </div>
            </div>
          </Form.Item>
        </section>

        <section className={sectionClass}>
          <div className="mb-6">
            <Title level={4} className="!mb-1">
              <ContactsOutlined className="mr-2 text-primary" />
              Contact
            </Title>
            <Text type="secondary">Shown in the footer and on the contact page.</Text>
          </div>
          <div className="mb-2 text-xs font-bold tracking-[0.16em] text-base-content/50 uppercase">Email addresses</div>
          <Form.List name="contactEmails">
            {(fields, { add, remove }) => (
              <div className="mb-6 space-y-2">
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="flex items-start gap-2">
                    <Form.Item
                      {...restField}
                      name={[name]}
                      className="mb-0 min-w-0 flex-1"
                      rules={[{ required: true, message: 'Email required' }, { type: 'email', message: 'Invalid email' }]}
                    >
                      <Input placeholder="info@sunholidaysltd.com" />
                    </Form.Item>
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} aria-label="Remove email" />
                  </div>
                ))}
                <Button type="dashed" onClick={() => add('')} block icon={<PlusOutlined />}>
                  Add email
                </Button>
              </div>
            )}
          </Form.List>

          <div className="mb-2 text-xs font-bold tracking-[0.16em] text-base-content/50 uppercase">Phone numbers</div>
          <Form.List name="contactPhones">
            {(fields, { add, remove }) => (
              <div className="mb-6 space-y-2">
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="flex items-start gap-2">
                    <Form.Item
                      {...restField}
                      name={[name]}
                      className="mb-0 min-w-0 flex-1"
                      rules={[{ required: true, message: 'Phone required' }]}
                    >
                      <Input placeholder="+880 1234 567890" />
                    </Form.Item>
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} aria-label="Remove phone" />
                  </div>
                ))}
                <Button type="dashed" onClick={() => add('')} block icon={<PlusOutlined />}>
                  Add phone
                </Button>
              </div>
            )}
          </Form.List>

          <Form.Item
            label="Office address"
            name="address"
            extra="Use line breaks for a multi-line address."
          >
            <TextArea rows={4} placeholder={"362/1, Holding 13/1 (2nd Floor)\nOld-27 New-16 Dhanmondi\nDhaka-1209, Bangladesh"} />
          </Form.Item>

          <Form.Item
            label="Google location link"
            name="googleMapsUrl"
            extra="A Google Maps share link or embed URL, used for Get Directions and the contact map."
            rules={[
              {
                validator: async (_, value) => {
                  const v = String(value || '').trim();
                  if (!v) return;
                  try {
                    // eslint-disable-next-line no-new
                    new URL(v);
                  } catch {
                    throw new Error('Enter a valid URL');
                  }
                },
              },
            ]}
          >
            <Input placeholder="https://maps.app.goo.gl/... or https://www.google.com/maps/embed?..." />
          </Form.Item>
        </section>

        <section className={sectionClass}>
          <div className="mb-6">
            <Title level={4} className="!mb-1">
              <ShareAltOutlined className="mr-2 text-primary" />
              Social links
            </Title>
            <Text type="secondary">These appear in the footer in the order listed here.</Text>
          </div>
          <Form.List name="socialLinks">
            {(fields, { add, remove, move }) => (
              <>
                {fields.length === 0 ? (
                  <Text type="secondary" className="mb-4 block">
                    No social links yet. Add one below or start from a preset.
                  </Text>
                ) : null}

                <div className="space-y-3">
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div key={key} className="rounded-2xl border border-base-300 bg-base-200/60 p-3">
                      <div className="flex flex-wrap items-start gap-2">
                        <Form.Item {...restField} name={[name, 'icon']} className="mb-0 w-full sm:w-44">
                          <IconPicker placeholder="Pick icon" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'label']}
                          className="mb-0 w-full sm:w-36"
                          rules={[{ required: true, message: 'Name required' }]}
                        >
                          <Input placeholder="Facebook" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'url']}
                          className="mb-0 min-w-48 flex-1"
                          rules={[{ required: true, message: 'URL required' }]}
                        >
                          <Input placeholder="https://facebook.com/sunholidays" />
                        </Form.Item>
                        <Space.Compact>
                          <Button
                            icon={<ArrowUpOutlined />}
                            disabled={index === 0}
                            onClick={() => move(index, index - 1)}
                            aria-label="Move up"
                          />
                          <Button
                            icon={<ArrowDownOutlined />}
                            disabled={index === fields.length - 1}
                            onClick={() => move(index, index + 1)}
                            aria-label="Move down"
                          />
                        </Space.Compact>
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                          aria-label="Remove social link"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  type="dashed"
                  onClick={() => add({ label: '', icon: DEFAULT_SOCIAL_ICON, url: '' })}
                  block
                  icon={<PlusOutlined />}
                  className="mt-4"
                >
                  Add social link
                </Button>

                <div className="mt-4">
                  <Text type="secondary" className="mr-2 text-xs">
                    Presets:
                  </Text>
                  {SUGGESTED_SOCIAL_LINKS.map((preset) => (
                    <Button
                      key={preset.label}
                      size="small"
                      className="mr-2 mb-2"
                      onClick={() => add({ ...preset })}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </>
            )}
          </Form.List>
        </section>
      </Form>
    </div>
  );
}
