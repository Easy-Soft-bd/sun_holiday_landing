"use client";

import { useEffect } from "react";
import { App, Descriptions, Form, Input, Modal, Select, Tag } from "antd";
import { LEAD_STATUS_OPTIONS, LeadRecord, LeadStatus } from "../types";

const { TextArea } = Input;

type FormValues = {
    status: LeadStatus;
    notes?: string;
};

type Props = {
    open: boolean;
    lead: LeadRecord | null;
    onClose: () => void;
    onSaved: (lead: LeadRecord) => void;
};

function formatDate(value: string | null | undefined) {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString();
}

export default function LeadDetailModal({ open, lead, onClose, onSaved }: Props) {
    const { message } = App.useApp();
    const [form] = Form.useForm<FormValues>();

    useEffect(() => {
        if (!open || !lead) return;
        form.setFieldsValue({
            status: lead.status,
            notes: lead.notes || "",
        });
    }, [open, lead, form]);

    const handleOk = async () => {
        if (!lead) return;
        try {
            const values = await form.validateFields();
            const res = await fetch(`/api/leads/${lead.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: values.status,
                    notes: values.notes?.trim() || "",
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Failed to update lead");
            message.success("Lead updated");
            onSaved(data as LeadRecord);
            onClose();
        } catch (err) {
            if (err instanceof Error) message.error(err.message);
        }
    };

    if (!lead) return null;

    return (
        <Modal
            title={`Lead from ${lead.name || "—"}`}
            open={open}
            onOk={handleOk}
            onCancel={onClose}
            okText="Save changes"
            destroyOnHidden
            width={680}
        >
            <Descriptions column={1} size="small" bordered className="mb-4">
                <Descriptions.Item label="Name">{lead.name}</Descriptions.Item>
                <Descriptions.Item label="Email">
                    <a href={`mailto:${lead.email}`}>{lead.email}</a>
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                    <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                </Descriptions.Item>
                <Descriptions.Item label="Source">
                    <Tag color="blue">{lead.source}</Tag>
                    {lead.pageUrl ? (
                        <a
                            href={lead.pageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-xs text-blue-500 hover:underline"
                        >
                            {lead.pageUrl}
                        </a>
                    ) : null}
                </Descriptions.Item>
                <Descriptions.Item label="Message">
                    <span className="whitespace-pre-line">{lead.message || "—"}</span>
                </Descriptions.Item>
                <Descriptions.Item label="IP / UA">
                    <div className="text-xs text-gray-500">
                        <div>IP: {lead.ipAddress || "—"}</div>
                        <div className="truncate">UA: {lead.userAgent || "—"}</div>
                        {lead.referrer ? <div className="truncate">Referrer: {lead.referrer}</div> : null}
                    </div>
                </Descriptions.Item>
                <Descriptions.Item label="Created">{formatDate(lead.createdAt)}</Descriptions.Item>
            </Descriptions>

            <Form form={form} layout="vertical">
                <Form.Item name="status" label="Status">
                    <Select
                        options={LEAD_STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
                    />
                </Form.Item>
                <Form.Item name="notes" label="Internal notes">
                    <TextArea rows={3} placeholder="Notes for follow-up" maxLength={4000} />
                </Form.Item>
            </Form>
        </Modal>
    );
}
