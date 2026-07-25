"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Table, Button, Space, Input, Tag, message, Popconfirm, Card, Row, Col, Statistic } from 'antd';
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
  ReadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import Link from 'next/link';

interface BlogRow {
  key: string;
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  image: string;
  publishedAt?: string | null;
}

export default function BlogManagementPage() {
  const [searchText, setSearchText] = useState('');
  const [posts, setPosts] = useState<BlogRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/blog');
      if (response.ok) {
        const data = await response.json();
        const formattedData = data.map((post: Record<string, unknown>) => ({
          key: String(post.id),
          id: String(post.id),
          title: String(post.title ?? ''),
          slug: String(post.slug ?? ''),
          category: String(post.category ?? ''),
          status: String(post.status ?? 'Draft'),
          image: String(post.image ?? ''),
          publishedAt: post.publishedAt ? String(post.publishedAt) : null,
        }));
        setPosts(formattedData);
      } else {
        message.error('Failed to fetch blog posts');
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      message.error('An error occurred while fetching blog posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        message.success('Post deleted successfully');
        void fetchPosts();
      } else {
        message.error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      message.error('An error occurred while deleting post');
    }
  };

  const columns: ColumnsType<BlogRow> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Link
          href={`/portal/admin/dashboard/blog/${record.id}/edit`}
          className="font-medium hover:underline"
        >
          {text}
        </Link>
      ),
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => (
        <div className="relative h-12 w-16 overflow-hidden rounded-md bg-gray-100">
          <img
            src={image || 'https://placehold.co/100x100?text=No+Image'}
            alt="Post thumbnail"
            className="h-full w-full object-cover"
          />
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="geekblue">{category}</Tag>,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      ellipsis: true,
      render: (slug) => <span className="font-mono text-xs text-gray-500">{slug}</span>,
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
        if (status === 'Active') color = 'success';
        else if (status === 'Inactive') color = 'error';
        return <Tag color={color}>{status?.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.slug ? (
            <a href={`/blog/${record.slug}`} target="_blank" rel="noopener noreferrer">
              <Button type="text" icon={<EyeOutlined />} />
            </a>
          ) : null}
          <Link href={`/portal/admin/dashboard/blog/${record.id}/edit`}>
            <Button type="text" icon={<EditOutlined />} className="text-blue-500 hover:text-blue-700" />
          </Link>
          <Popconfirm
            title="Delete this post"
            description="Are you sure you want to delete this blog post?"
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
    const total = posts.length;
    let active = 0;
    let draft = 0;
    let inactive = 0;
    for (const p of posts) {
      if (p.status === 'Active') active += 1;
      else if (p.status === 'Draft') draft += 1;
      else if (p.status === 'Inactive') inactive += 1;
    }
    return { total, active, draft, inactive };
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [posts, searchText]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Blog Management</h1>
          <p className="text-sm text-gray-500">Write, edit, and publish travel stories.</p>
        </div>
        <Link href="/portal/admin/dashboard/blog/add">
          <Button type="primary" icon={<PlusOutlined />} size="large" className="bg-primary">
            New Post
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
              title="Published"
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
            placeholder="Search posts by title, slug, or category…"
            prefix={<SearchOutlined className="text-gray-400" />}
            className="max-w-md"
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredPosts}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          loading={loading}
          locale={{
            emptyText: (
              <div className="py-8 text-center text-gray-500">
                <ReadOutlined className="mb-2 text-3xl" />
                <p>No blog posts yet. Create your first story.</p>
              </div>
            ),
          }}
        />
      </div>
    </div>
  );
}
