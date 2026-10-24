"use client";

import { useEffect, useMemo, useState } from "react";
import { App, Button, Card, Col, Input, Popconfirm, Row, Space, Statistic, Table, Tag } from "antd";
import {
  CheckCircleTwoTone,
  DeleteOutlined,
  EditOutlined,
  PauseCircleTwoTone,
  PlusOutlined,
  SearchOutlined,
  SendOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";

interface TicketRow {
  key: string;
  id: string;
  from: string;
  to: string;
  airline: string;
  priceFrom: number | null;
  image: string;
  status: string;
  sortOrder: number;
}

const currency = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});

export default function TicketRoutesPage() {
  const { message } = App.useApp();
  const [searchText, setSearchText] = useState("");
  const [routes, setRoutes] = useState<TicketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ticket-routes");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = (await response.json()) as Array<Record<string, unknown>>;
      setRoutes(
        data.map((route) => ({
          key: String(route.id),
          id: String(route.id),
          from: String(route.from ?? ""),
          to: String(route.to ?? ""),
          airline: String(route.airline ?? ""),
          priceFrom: route.priceFrom == null ? null : Number(route.priceFrom),
          image: String(route.image ?? ""),
          status: String(route.status ?? "Active"),
          sortOrder: Number(route.sortOrder ?? 0),
        }))
      );
    } catch (error) {
      console.error("Error fetching ticket routes:", error);
      message.error("Could not load ticket routes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchRoutes();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/ticket-routes/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      message.success("Route deleted");
      void fetchRoutes();
    } catch (error) {
      console.error("Error deleting ticket route:", error);
      message.error("Could not delete this route");
    } finally {
      setDeletingId(null);
    }
  };

  const columns: ColumnsType<TicketRow> = [
    {
      title: "Route",
      key: "route",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="h-12 w-16 overflow-hidden rounded-md bg-gray-100">
            {record.image ? <img src={record.image} alt="" className="h-full w-full object-cover" /> : null}
          </div>
          <div>
            <Link href={`/portal/admin/dashboard/tickets/${record.id}/edit`} className="font-medium hover:underline">
              {record.from} → {record.to}
            </Link>
            {record.airline ? <div className="text-xs text-gray-500">{record.airline}</div> : null}
          </div>
        </div>
      ),
    },
    {
      title: "From",
      dataIndex: "priceFrom",
      key: "priceFrom",
      render: (price: number | null) => (price == null ? "—" : currency.format(price)),
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
        { text: "Inactive", value: "Inactive" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => <Tag color={status === "Active" ? "success" : "default"}>{status?.toUpperCase()}</Tag>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link href={`/portal/admin/dashboard/tickets/${record.id}/edit`}>
            <Button type="text" icon={<EditOutlined />} className="text-blue-500 hover:text-blue-700" />
          </Link>
          <Popconfirm
            title="Delete this route"
            description="It will disappear from the Ticket page."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            okButtonProps={{ loading: deletingId === record.id }}
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} loading={deletingId === record.id} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const summary = useMemo(() => {
    let active = 0;
    let inactive = 0;
    for (const route of routes) {
      if (route.status === "Active") active += 1;
      else inactive += 1;
    }
    return { total: routes.length, active, inactive };
  }, [routes]);

  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return routes;
    return routes.filter(
      (route) =>
        route.from.toLowerCase().includes(q) ||
        route.to.toLowerCase().includes(q) ||
        route.airline.toLowerCase().includes(q)
    );
  }, [routes, searchText]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ticket Routes</h1>
          <p className="text-sm text-gray-500">
            These cards appear on the Ticket page. A click opens a name and phone query for that route.
          </p>
        </div>
        <Link href="/portal/admin/dashboard/tickets/add">
          <Button type="primary" icon={<PlusOutlined />} size="large" className="bg-primary">
            New route
          </Button>
        </Link>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={12} md={8}>
          <Card variant="borderless" className="shadow-sm">
            <Statistic title="Total" value={summary.total} prefix={<SendOutlined />} loading={loading} />
          </Card>
        </Col>
        <Col xs={12} md={8}>
          <Card variant="borderless" className="shadow-sm">
            <Statistic
              title="Active"
              value={summary.active}
              styles={{ content: { color: "#16a34a" } }}
              prefix={<CheckCircleTwoTone twoToneColor="#16a34a" />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
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
            placeholder="Search by city or airline…"
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
                <SendOutlined className="mb-2 text-3xl" />
                <p>No ticket routes yet. Add the first route.</p>
              </div>
            ),
          }}
        />
      </div>
    </div>
  );
}
