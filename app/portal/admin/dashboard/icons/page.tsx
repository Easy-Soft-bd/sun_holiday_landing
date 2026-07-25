"use client";

import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CopyOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  useCreateCustomIconMutation,
  useDeleteCustomIconMutation,
  useGetCustomIconsQuery,
  useUpdateCustomIconMutation,
} from '@/src/lib/redux/api/customIconsApi';
import type { SerializedCustomIcon } from '@/src/lib/icons/custom-icon-payload';
import { parseCustomIconSvg } from '@/src/lib/icons/custom-icon-svg';
import { slugifyIconName } from '@/src/lib/icons/custom-icon-ref';
import CustomIconSvg from '@/src/components/common/CustomIconSvg';
import { refreshCustomIcons } from '@/src/components/common/use-custom-icons';

const { Title, Text, Paragraph } = Typography;

const EXAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none"><circle cx="12" cy="12" r="8" fill="currentColor" fill-opacity=".25"/><path stroke="currentColor" stroke-linecap="round" stroke-width="1.2" d="m8.5 11l2.293 2.293a1 1 0 0 0 1.414 0L19.5 6"/></g></svg>`;

interface IconFormValues {
  label: string;
  name: string;
  svg: string;
}

export default function IconLibraryPage() {
  const [form] = Form.useForm<IconFormValues>();
  const { data, isLoading, isError, refetch } = useGetCustomIconsQuery();
  const [createIcon, { isLoading: isCreating }] = useCreateCustomIconMutation();
  const [updateIcon, { isLoading: isUpdating }] = useUpdateCustomIconMutation();
  const [deleteIcon] = useDeleteCustomIconMutation();

  const [editing, setEditing] = useState<SerializedCustomIcon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const icons = data?.data ?? [];

  const svgValue = Form.useWatch('svg', form) ?? '';
  const labelValue = Form.useWatch('label', form) ?? '';

  const preview = useMemo(
    () => (svgValue.trim() ? parseCustomIconSvg(svgValue) : null),
    [svgValue],
  );

  // Keep the reference name in step with the label until the icon exists.
  useEffect(() => {
    if (!isModalOpen || editing) {
      return;
    }
    form.setFieldValue('name', slugifyIconName(labelValue));
  }, [labelValue, isModalOpen, editing, form]);

  const openCreate = () => {
    setEditing(null);
    form.setFieldsValue({ label: '', name: '', svg: '' });
    setIsModalOpen(true);
  };

  const openEdit = (icon: SerializedCustomIcon) => {
    setEditing(icon);
    form.setFieldsValue({ label: icon.label, name: icon.name, svg: icon.svg });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const body = {
        label: values.label.trim(),
        name: slugifyIconName(values.name || values.label),
        svg: values.svg,
      };

      if (editing) {
        await updateIcon({ id: editing.id, ...body }).unwrap();
        message.success(`Updated "${body.label}"`);
      } else {
        await createIcon(body).unwrap();
        message.success(`Added "${body.label}"`);
      }

      refreshCustomIcons();
      setIsModalOpen(false);
      setEditing(null);
    } catch (error) {
      const apiError = error as { data?: { error?: string } };
      if (apiError?.data?.error) {
        message.error(apiError.data.error);
      }
    }
  };

  const handleDelete = async (icon: SerializedCustomIcon) => {
    try {
      await deleteIcon(icon.id).unwrap();
      refreshCustomIcons();
      message.success(`Deleted "${icon.label}"`);
    } catch {
      message.error('Failed to delete icon');
    }
  };

  const copyReference = async (iconName: string) => {
    try {
      await navigator.clipboard.writeText(iconName);
      message.success(`Copied ${iconName}`);
    } catch {
      message.error('Could not copy to clipboard');
    }
  };

  const columns: ColumnsType<SerializedCustomIcon> = [
    {
      title: 'Icon',
      dataIndex: 'iconName',
      width: 90,
      align: 'center',
      render: (_, record) =>
        record.content ? (
          <CustomIconSvg icon={record.content} size={28} title={record.label} />
        ) : (
          <Text type="danger">invalid</Text>
        ),
    },
    {
      title: 'Name',
      dataIndex: 'label',
      render: (label: string) => <span className="font-medium">{label}</span>,
      sorter: (a, b) => a.label.localeCompare(b.label),
    },
    {
      title: 'Reference',
      dataIndex: 'iconName',
      render: (iconName: string) => (
        <Space size={4}>
          <Tag className="font-mono">{iconName}</Tag>
          <Button
            type="text"
            size="small"
            icon={<CopyOutlined />}
            onClick={() => copyReference(iconName)}
            title="Copy reference"
          />
        </Space>
      ),
    },
    {
      title: 'Actions',
      width: 120,
      align: 'right',
      render: (_, record) => (
        <Space size={0}>
          <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          <Popconfirm
            title="Delete this icon"
            description="Anywhere it is used will fall back to a default icon."
            onConfirm={() => handleDelete(record)}
            okText="Delete"
            cancelText="Cancel"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Icon library
          </Title>
          <Text type="secondary">
            Paste any SVG to add your own icons. They appear in every icon picker across the
            dashboard alongside the built-in library.
          </Text>
        </div>
        <Space>
          <Button onClick={() => refetch()}>Refresh</Button>
          <Button type="primary" size="large" icon={<PlusOutlined />} onClick={openCreate}>
            Add icon
          </Button>
        </Space>
      </div>

      {isError && (
        <Alert
          className="mb-4"
          type="error"
          showIcon
          message="Could not load the icon library"
          description="Check that the database is reachable, then press Refresh."
        />
      )}

      <Card variant="borderless" className="shadow-sm">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={icons}
          loading={isLoading}
          pagination={icons.length > 10 ? { pageSize: 10, showSizeChanger: true } : false}
          locale={{
            emptyText: (
              <div className="py-8">
                <Paragraph type="secondary" className="mb-2">
                  No custom icons yet.
                </Paragraph>
                <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
                  Add your first icon
                </Button>
              </div>
            ),
          }}
        />
      </Card>

      <Card variant="borderless" className="mt-4 shadow-sm">
        <Text strong>Using an icon</Text>
        <Paragraph type="secondary" className="mt-2 mb-0">
          Pick it from any icon picker, or paste its reference (for example{' '}
          <Text code>custom:my-icon</Text>) into any field that stores an icon name. Icons drawn
          with <Text code>currentColor</Text> automatically follow the surrounding text colour.
        </Paragraph>
      </Card>

      <Modal
        title={editing ? `Edit "${editing.label}"` : 'Add icon'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          setEditing(null);
        }}
        okText={editing ? 'Save changes' : 'Add icon'}
        confirmLoading={isCreating || isUpdating}
        destroyOnHidden
        width={720}
      >
        <Form form={form} layout="vertical" requiredMark={false} className="mt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Item
              label="Name"
              name="label"
              rules={[{ required: true, message: 'Give the icon a name' }]}
            >
              <Input placeholder="Verified badge" />
            </Form.Item>
            <Form.Item
              label="Reference"
              name="name"
              extra="Used to refer to the icon. Letters, numbers and dashes."
              rules={[
                { required: true, message: 'A reference name is required' },
                {
                  validator: (_, value) =>
                    slugifyIconName(value)
                      ? Promise.resolve()
                      : Promise.reject(new Error('Needs at least one letter or number')),
                },
              ]}
            >
              <Input addonBefore="custom:" placeholder="verified-badge" />
            </Form.Item>
          </div>

          <Form.Item
            label="SVG markup"
            name="svg"
            rules={[{ required: true, message: 'Paste the SVG markup' }]}
          >
            <Input.TextArea rows={7} placeholder={EXAMPLE_SVG} className="font-mono text-xs" />
          </Form.Item>

          {preview?.ok === false && (
            <Alert type="error" showIcon message="This SVG cannot be used" description={preview.error} />
          )}

          {preview?.ok && (
            <div className="rounded-lg border border-black/10 p-4">
              <Text type="secondary" className="mb-3 block text-xs uppercase tracking-wide">
                Preview
              </Text>
              <div className="flex flex-wrap items-end gap-6">
                <Space align="end" size="large">
                  <CustomIconSvg icon={preview.icon} size={16} />
                  <CustomIconSvg icon={preview.icon} size={24} />
                  <CustomIconSvg icon={preview.icon} size={40} />
                </Space>
                <Space align="end" size="large" className="text-blue-600">
                  <CustomIconSvg icon={preview.icon} size={40} />
                </Space>
                <div className="rounded bg-neutral-900 px-4 py-2 text-white">
                  <CustomIconSvg icon={preview.icon} size={40} />
                </div>
              </div>
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
}
