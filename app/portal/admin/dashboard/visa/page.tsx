"use client";

import React, { useEffect, useMemo, useState } from "react";
import { App, Table, Button, Space, Input, Tag, Popconfirm, Card, Row, Col, Statistic } from "antd";
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
  GlobalOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";

interface VisaRow {
  key: string;
  id: string;
  name: string;
  slug: string;
  status: string;
  sortOrder: number;
  coverImage: string;
  flagImage: string;
  flagEmoji: string;
}

export default function VisaManagementPage() {
  const { message } = App.useApp();
  const [searchText, setSearchText] = useState("");
  const [countries, setCountries] = useState<VisaRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/visa");
      if (response.ok) {
        const data = await response.json();
        setCountries(
          data.map((country: Record<string, unknown>) => ({
            key: String(country.id),
            id: String(country.id),
            name: String(country.name ?? ""),
            slug: String(country.slug ?? ""),
            status: String(country.status ?? "Draft"),
            sortOrder: Number(country.sortOrder ?? 0),
            coverImage: String(country.coverImage ?? ""),
            flagImage: String(country.flagImage ?? ""),
            flagEmoji: String(country.flagEmoji ?? ""),
          }))
        );
      } else {
        message.error("Failed to fetch visa countries");
      }
    } catch (error) {
      console.error("Error fetching visa countries:", error);
      message.error("An error occurred while fetching visa countries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCountries();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/visa/${id}`, { method: "DELETE" });
      if (response.ok) {
        message.success("Country deleted");
        void fetchCountries();
      } else {
        message.error("Failed to delete country");
      }
    } catch (error) {
      console.error("Error deleting visa country:", error);
      message.error("An error occurred while deleting the country");
    }
  };

  const columns: ColumnsType<VisaRow> = [
    {
      title: "Country",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          {record.flagImage ? (
            <img src={record.flagImage} alt="" className="h-6 w-8 rounded object-cover" />
          ) : (
            <span className="text-xl leading-none" aria-hidden>
              {record.flagEmoji || "🏳️"}
            </span>
          )}
          <Link href={`/portal/admin/dashboard/visa/${record.id}/edit`} className="font-medium hover:underline">
            {text}
          </Link>
        </div>
      ),
    },
    {
      title: "Cover",
      dataIndex: "coverImage",
      key: "coverImage",
      render: (image) => (
        <div className="relative h-12 w-16 overflow-hidden rounded-md bg-gray-100">
          <img src={image || "https://placehold.co/100x100?text=No+Image"} alt="" className="h-full w-full object-cover" />
        </div>
      ),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      ellipsis: true,
      render: (slug) => <span className="font-mono text-xs text-gray-500">/visa/{slug}</span>,
    },
    {
      title: "Order",
      dataIndex: "sortOrder",
      key: "sortOrder",
      width: 90,
      sorter: (a, b) => a.sortOrder - b.sortOrder,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Active", value: "Active" },
        { text: "Draft", value: "Draft" },
        { text: "Inactive", value: "Inactive" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        let color = "default";
        if (status === "Active") color = "success";
        else if (status === "Inactive") color = "error";
        return <Tag color={color}>{status?.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {record.status === "Active" && record.slug ? (
            <a href={`/visa/${record.slug}`} target="_blank" rel="noopener noreferrer">
              <Button type="text" icon={<EyeOutlined />} />
            </a>
          ) : null}
          <Link href={`/portal/admin/dashboard/visa/${record.id}/edit`}>
            <Button type="text" icon={<EditOutlined />} className="text-blue-500 hover:text-blue-700" />
          </Link>
          <Popconfirm
            title="Delete this country"
            description="The public visa page for this country will be removed."
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
    let active = 0;
    let draft = 0;
    let inactive = 0;
    for (const country of countries) {
      if (country.status === "Active") active += 1;
      else if (country.status === "Draft") draft += 1;
      else if (country.status === "Inactive") inactive += 1;
    }
    return { total: countries.length, active, draft, inactive };
  }, [countries]);

  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter(
      (country) => country.name.toLowerCase().includes(q) || country.slug.toLowerCase().includes(q)
    );
  }, [countries, searchText]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Visa Countries</h1>
          <p className="text-sm text-gray-500">
            Add countries and edit the visa guidance that appears on each public country page.
          </p>
        </div>
        <Link href="/portal/admin/dashboard/visa/add">
          <Button type="primary" icon={<PlusOutlined />} size="large" className="bg-primary">
            New country
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
              styles={{ content: { color: "#16a34a" } }}
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
              styles={{ content: { color: "#6b7280" } }}
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
              styles={{ content: { color: "#dc2626" } }}
              prefix={<PauseCircleTwoTone twoToneColor="#dc2626" />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <div className="rounded-lg bg-white p-4 shadow-sm">
        <div className="mb-4">
          <Input
            placeholder="Search countries by name or slug…"
            prefix={<SearchOutlined className="text-gray-400" />}
            className="max-w-md"
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filtered}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          loading={loading}
          locale={{
            emptyText: (
              <div className="py-8 text-center text-gray-500">
                <GlobalOutlined className="mb-2 text-3xl" />
                <p>No visa countries yet. Add the first country.</p>
              </div>
            ),
          }}
        />
      </div>
    </div>
  );
}
