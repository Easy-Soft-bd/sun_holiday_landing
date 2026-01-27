"use client";

import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Input, Tag, message, Popconfirm } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
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
}

export default function TourManagementPage() {
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
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) =>
        record.title.toLowerCase().includes((value as string).toLowerCase()),
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
      render: (category) => {
        let color = 'geekblue';
        if (category === 'Domestic') {
          color = 'green';
        } else if (category === 'Hajj & Umrah') {
          color = 'gold';
        }
        return (
          <Tag color={color} key={category}>
            {category.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        if (status === 'Active') {
          color = 'success';
        } else if (status === 'Inactive') {
          color = 'error';
        }
        return (
          <Tag color={color} key={status}>
            {status.toUpperCase()}
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Tour Management</h1>
        <Link href="/portal/admin/dashboard/tours/add">
            <Button type="primary" icon={<PlusOutlined />} size="large" className="bg-primary">
            Add New Tour
            </Button>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="mb-4">
          <Input
            placeholder="Search tours..."
            prefix={<SearchOutlined className="text-gray-400" />}
            className="max-w-md"
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <Table
          columns={columns}
          dataSource={tours}
          pagination={{ pageSize: 10 }}
          loading={loading}
        />
      </div>
    </div>
  );
}
