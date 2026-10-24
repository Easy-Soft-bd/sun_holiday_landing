"use client";

import { useCallback, useEffect, useState } from "react";
import { App, Button, Checkbox, Form, Input, Modal, Popconfirm, Space, Switch, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PERMISSIONS, PERMISSION_LABELS, type Permission } from "@/src/lib/permissions";

const { Title, Text } = Typography;

type AdminRow = {
    id: number;
    email: string;
    name: string | null;
    role: string;
    isActive: boolean;
    isSuperAdmin: boolean;
    permissions: Permission[];
};

type FormValues = {
    name: string;
    email: string;
    password?: string;
    permissions: Permission[];
    isActive: boolean;
};

export default function AdminUsersPage() {
    const { message } = App.useApp();
    const [rows, setRows] = useState<AdminRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [removingId, setRemovingId] = useState<number | null>(null);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<AdminRow | null>(null);
    const [form] = Form.useForm<FormValues>();

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin-users", { cache: "no-store" });
            const body = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(body.error || "Could not load admin users");
            setRows(Array.isArray(body.data) ? body.data : []);
        } catch (error) {
            message.error(error instanceof Error ? error.message : "Could not load admin users");
        } finally {
            setLoading(false);
        }
    }, [message]);

    useEffect(() => {
        void load();
    }, [load]);

    function openCreate() {
        setEditing(null);
        form.setFieldsValue({ name: "", email: "", password: "", permissions: [], isActive: true });
        setOpen(true);
    }

    function openEdit(row: AdminRow) {
        setEditing(row);
        form.setFieldsValue({
            name: row.name || "",
            email: row.email,
            password: "",
            permissions: row.permissions,
            isActive: row.isActive,
        });
        setOpen(true);
    }

    async function onFinish(values: FormValues) {
        setSaving(true);
        try {
            const payload: Record<string, unknown> = {
                name: values.name,
                email: values.email,
            };
            if (values.password) payload.password = values.password;
            if (!editing?.isSuperAdmin) {
                payload.permissions = values.permissions ?? [];
                payload.isActive = values.isActive;
            }
            const res = await fetch(editing ? `/api/admin-users/${editing.id}` : "/api/admin-users", {
                method: editing ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const body = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(body.error || "Could not save this admin");
            message.success(editing ? "Admin updated" : "Admin created");
            setOpen(false);
            await load();
        } catch (error) {
            message.error(error instanceof Error ? error.message : "Could not save this admin");
        } finally {
            setSaving(false);
        }
    }

    async function remove(row: AdminRow) {
        setRemovingId(row.id);
        try {
            const res = await fetch(`/api/admin-users/${row.id}`, { method: "DELETE" });
            const body = await res.json().catch(() => ({}));
            if (!res.ok) {
                message.error(body.error || "Could not delete this admin");
                return;
            }
            message.success("Admin removed");
            await load();
        } finally {
            setRemovingId(null);
        }
    }

    const columns: ColumnsType<AdminRow> = [
        { title: "Name", dataIndex: "name", render: (name: string | null) => name || "—" },
        { title: "Email", dataIndex: "email" },
        {
            title: "Status",
            dataIndex: "isActive",
            render: (active: boolean) => (active ? <Tag color="green">Active</Tag> : <Tag>Inactive</Tag>),
        },
        {
            title: "Access",
            dataIndex: "permissions",
            render: (_value, row) =>
                row.isSuperAdmin ? (
                    <Tag color="gold">Super Admin</Tag>
                ) : row.permissions.length ? (
                    <Space size={[4, 4]} wrap>
                        {row.permissions.map((key) => (
                            <Tag key={key}>{PERMISSION_LABELS[key]}</Tag>
                        ))}
                    </Space>
                ) : (
                    <Text type="secondary">No areas</Text>
                ),
        },
        {
            title: "",
            key: "actions",
            width: 180,
            render: (_value, row) => (
                <Space>
                    <Button size="small" onClick={() => openEdit(row)}>
                        Edit
                    </Button>
                    {row.isSuperAdmin ? null : (
                        <Popconfirm
                            title="Remove this admin?"
                            okText="Remove"
                            okButtonProps={{ loading: removingId === row.id }}
                            onConfirm={() => remove(row)}
                        >
                            <Button size="small" danger loading={removingId === row.id}>
                                Remove
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <Title level={2} style={{ margin: 0 }}>
                        Admin users
                    </Title>
                    <Text type="secondary">Choose which dashboard areas each admin can open.</Text>
                </div>
                <Button type="primary" onClick={openCreate}>
                    Add admin
                </Button>
            </div>

            <Table rowKey="id" loading={loading} columns={columns} dataSource={rows} pagination={false} />

            <Modal
                title={editing ? "Edit admin" : "Add admin"}
                open={open}
                onCancel={() => setOpen(false)}
                onOk={() => form.submit()}
                confirmLoading={saving}
                okText={editing ? "Save" : "Create"}
                destroyOnHidden
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item name="name" label="Name" rules={[{ required: true, message: "Name is required" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: "Email is required" },
                            { type: "email", message: "Enter a valid email" },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label={editing ? "New password" : "Password"}
                        extra={editing ? "Leave blank to keep the current password." : undefined}
                        rules={
                            editing
                                ? [{ min: 8, message: "Password must be at least 8 characters" }]
                                : [
                                      { required: true, message: "Password is required" },
                                      { min: 8, message: "Password must be at least 8 characters" },
                                  ]
                        }
                    >
                        <Input.Password />
                    </Form.Item>
                    {editing?.isSuperAdmin ? (
                        <Text type="secondary">This Super Admin keeps every area. Access cannot be changed.</Text>
                    ) : (
                        <>
                            <Form.Item name="permissions" label="Areas">
                                <Checkbox.Group
                                    options={PERMISSIONS.map((key) => ({ label: PERMISSION_LABELS[key], value: key }))}
                                />
                            </Form.Item>
                            {editing ? (
                                <Form.Item name="isActive" label="Active" valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            ) : null}
                        </>
                    )}
                </Form>
            </Modal>
        </div>
    );
}
