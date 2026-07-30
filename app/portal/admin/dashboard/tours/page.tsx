"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { App, Table, Button, Space, Input, Tag, Popconfirm, Card, Row, Col, Statistic } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  AppstoreOutlined,
  CheckCircleTwoTone,
  FileSearchOutlined,
  PauseCircleTwoTone,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import Link from 'next/link';

interface TourDataType {
  key: string;
  id: string;
  title: string;
  location: string;
  price: number;
  category: string;
  status: string;
  image: string;
  showOnHome: boolean;
  homeSortOrder: number;
}

export default function TourManagementPage() {
  const { message } = App.useApp();
  const [searchText, setSearchText] = useState('');
  const [tours, setTours] = useState<TourDataType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tours');
      if (response.ok) {
        const data = await response.json();
        const formattedData = data.map((tour: any) => ({
          key: tour.id,
          id: tour.id,
          title: tour.title,
          location: tour.location,
          price: tour.price,
          category: tour.category,
          status: tour.status,
          image: tour.image,
          showOnHome: Boolean(tour.showOnHome),
          homeSortOrder: Number(tour.homeSortOrder ?? 0),
        }));
        setTours(formattedData);
      } else {
        message.error('Failed to fetch tours');
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
      message.error('An error occurred while fetching tours');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/tours/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        message.success('Tour deleted successfully');
        fetchTours(); // Refresh list
      } else {
        message.error('Failed to delete tour');
      }
    } catch (error) {
      console.error('Error deleting tour:', error);
      message.error('An error occurred while deleting tour');
    }
  };

  const columns: ColumnsType<TourDataType> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Link href={`/portal/admin/dashboard/tours/${record.id}`} className="font-medium hover:underline">
          {text}
        </Link>
      ),
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => (
        <div className="w-16 h-12 relative rounded-md overflow-hidden bg-gray-100">
          <img 
            src={image || 'https://placehold.co/100x100?text=No+Image'} 
            alt="Tour thumbnail" 
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: 'International', value: 'International' },
        { text: 'Domestic', value: 'Domestic' },
        { text: 'Hajj & Umrah', value: 'Hajj & Umrah' },
      ],
      onFilter: (value, record) => record.category === value,
      render: (category) => {
        let color = 'geekblue';
        if (category === 'Domestic') {
          color = 'green';
        } else if (category === 'Hajj & Umrah') {
          color = 'gold';
        }
        return (
          <Tag color={color} key={category}>
            {category?.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'Draft', value: 'Draft' },
        { text: 'Inactive', value: 'Inactive' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        let color = 'default';
        if (status === 'Active') {
          color = 'success';
        } else if (status === 'Inactive') {
          color = 'error';
        }
        return (
          <Tag color={color} key={status}>
            {status?.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `৳${price.toLocaleString()}`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Home',
      dataIndex: 'showOnHome',
      key: 'showOnHome',
      filters: [
        { text: 'On home', value: true },
        { text: 'Not on home', value: false },
      ],
      onFilter: (value, record) => Boolean(record.showOnHome) === value,
      render: (showOnHome) =>
        showOnHome ? <Tag color="processing">Home</Tag> : <Tag>Off</Tag>,
    },
    {
      title: 'Home order',
      dataIndex: 'homeSortOrder',
      key: 'homeSortOrder',
      sorter: (a, b) => (a.homeSortOrder ?? 0) - (b.homeSortOrder ?? 0),
      render: (order, record) => (record.showOnHome ? order ?? 0 : '—'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
            <Link href={`/portal/admin/dashboard/tours/${record.id}`}>
                <Button type="text" icon={<EyeOutlined />} />
            </Link>
          <Link href={`/portal/admin/dashboard/tours/${record.id}/edit`}>
            <Button type="text" icon={<EditOutlined />} className="text-blue-500 hover:text-blue-700" />
          </Link>
          <Popconfirm
            title="Delete the tour"
            description="Are you sure to delete this tour?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const summary = useMemo(() => {
    const total = tours.length;
    let active = 0;
    let draft = 0;
    let inactive = 0;
    for (const t of tours) {
      if (t.status === 'Active') active += 1;
      else if (t.status === 'Draft') draft += 1;
      else if (t.status === 'Inactive') inactive += 1;
    }
    return { total, active, draft, inactive };
  }, [tours]);

  const filteredTours = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return tours;
    return tours.filter((t) => t.title.toLowerCase().includes(q));
  }, [tours, searchText]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tour Management</h1>
          <p className="text-sm text-gray-500">Create, edit, and publish tours.</p>
        </div>
        <Link href="/portal/admin/dashboard/tours/add">
          <Button type="primary" icon={<PlusOutlined />} size="large" className="bg-primary">
            Add New Tour
          </Button>
        </Link>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={12} md={6}>
          <Card variant="borderless" className="shadow-sm">
            <Statistic title="Total" value={summary.total} prefix={<AppstoreOutlined />} loading={loading} />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card variant="borderless" className="shadow-sm">
            <Statistic
              title="Active"
              value={summary.active}
              styles={{ content: { color: '#16a34a' } }}
              prefix={<CheckCircleTwoTone twoToneColor="#16a34a" />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card variant="borderless" className="shadow-sm">
            <Statistic
              title="Drafts"
              value={summary.draft}
              styles={{ content: { color: '#6b7280' } }}
              prefix={<FileSearchOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card variant="borderless" className="shadow-sm">
            <Statistic
              title="Inactive"
              value={summary.inactive}
              styles={{ content: { color: '#dc2626' } }}
              prefix={<PauseCircleTwoTone twoToneColor="#dc2626" />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <div className="rounded-lg bg-white p-4 shadow-sm">
        <div className="mb-4">
          <Input
            placeholder="Search tours by title…"
            prefix={<SearchOutlined className="text-gray-400" />}
            className="max-w-md"
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredTours}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          loading={loading}
        />
      </div>
    </div>
  );
}
