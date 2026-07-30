"use client";

import { useEffect, useMemo, useState } from "react";
import { App, DatePicker, Form, Input, Modal, Select } from "antd";
import dayjs, { Dayjs } from "dayjs";
import {
    BOOKING_SERVICE_OPTIONS,
    BOOKING_STATUS_OPTIONS,
    BookingRecord,
    BookingServiceType,
    BookingStatus,
    TourLite,
} from "../types";

const { TextArea } = Input;

type FormValues = {
    name: string;
    phone: string;
    email?: string;
    tourId?: number | null;
    serviceType?: BookingServiceType;
    serviceTitle?: string;
    bookingDate?: Dayjs | null;
    message?: string;
    source?: string;
    status?: BookingStatus;
    notes?: string;
};

type Props = {
    open: boolean;
    initial?: BookingRecord | null;
    onClose: () => void;
    onSaved: (record: BookingRecord) => void;
};

function bookingTourId(record: BookingRecord | null | undefined): number | null {
    if (!record) return null;
    return record.Tour?.id ?? record.tourId ?? null;
}

export default function BookingFormModal({ open, initial, onClose, onSaved }: Props) {
    const { message } = App.useApp();
    const [form] = Form.useForm<FormValues>();
    const isEdit = Boolean(initial?.id);

    const [tours, setTours] = useState<TourLite[]>([]);
    const [toursLoading, setToursLoading] = useState(false);

    useEffect(() => {
        if (!open) return;
        let alive = true;
        (async () => {
            try {
                setToursLoading(true);
                const res = await fetch("/api/tours", { cache: "no-store" });
                if (!res.ok) return;
                const data = (await res.json()) as Array<TourLite & { status?: string }>;
                if (!alive) return;
                const list: TourLite[] = Array.isArray(data)
                    ? data.map((t) => ({
                          id: Number(t.id),
                          title: String(t.title || ""),
                          slug: t.slug ?? null,
                          status: t.status,
                      }))
                    : [];
                setTours(list);
            } catch {
                // Non-blocking — admin can still save without picking a tour.
            } finally {
                if (alive) setToursLoading(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, [open]);

    useEffect(() => {
        if (!open) return;
        if (initial) {
            form.setFieldsValue({
                name: initial.name,
                phone: initial.phone,
                email: initial.email ?? "",
                tourId: bookingTourId(initial),
                serviceType: initial.serviceType ?? "general",
                serviceTitle: initial.serviceTitle ?? "",
                bookingDate: initial.bookingDate ? dayjs(initial.bookingDate) : null,
                message: initial.message || "",
                source: initial.source || "",
                status: initial.status,
                notes: initial.notes || "",
            });
        } else {
            form.resetFields();
            form.setFieldsValue({
                status: "New",
                source: "admin",
                tourId: null,
                serviceType: "general",
            });
        }
    }, [open, initial, form]);

    const tourOptions = useMemo(() => {
        const fallback: TourLite[] = [];
        // Always include the currently linked tour even if the catalog is filtered/old.
        if (initial && initial.tourId && initial.tourTitle) {
            if (!tours.some((t) => t.id === initial.tourId)) {
                fallback.push({
                    id: initial.tourId,
                    title: initial.tourTitle,
                    slug: initial.tourSlug,
                });
            }
        }
        return [...tours, ...fallback]
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((t) => ({
                value: t.id,
                label: `${t.title}${t.slug ? ` · /${t.slug}` : ""}`,
            }));
    }, [tours, initial]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const serviceType = values.serviceType ?? "general";
            const tourId = serviceType === "tour" ? (values.tourId ?? null) : null;
            const payload: Record<string, unknown> = {
                name: values.name?.trim(),
                phone: values.phone?.trim(),
                email: values.email?.trim().toLowerCase() || "",
                message: values.message?.trim() || "",
                source: values.source?.trim() || "admin",
                bookingDate: values.bookingDate ? values.bookingDate.format("YYYY-MM-DD") : null,
                tourId,
                serviceType,
                serviceTitle: values.serviceTitle?.trim() || null,
            };
            if (isEdit) {
                payload.status = values.status;
                payload.notes = values.notes?.trim() || "";
            }

            const url = isEdit ? `/api/bookings/${initial?.id}` : "/api/bookings";
            const method = isEdit ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.error || "Failed to save booking");
            }
            message.success(isEdit ? "Booking updated" : "Booking created");
            onSaved(data as BookingRecord);
            onClose();
        } catch (err) {
            if (err instanceof Error) {
                message.error(err.message);
            }
        }
    };

    return (
        <Modal
            title={isEdit ? "Edit booking" : "New booking"}
            open={open}
            onOk={handleOk}
            onCancel={onClose}
            okText={isEdit ? "Save" : "Create"}
            destroyOnHidden
            maskClosable={false}
            width={620}
        >
            <Form
                form={form}
                layout="vertical"
                requiredMark="optional"
                initialValues={{
                    status: "New",
                    source: "admin",
                    tourId: null,
                    serviceType: "general",
                }}
            >
                <div className="grid gap-x-4 md:grid-cols-2">
                    <Form.Item
                        name="serviceType"
                        label="Service"
                        rules={[{ required: true, message: "Service type is required" }]}
                    >
                        <Select
                            options={BOOKING_SERVICE_OPTIONS.map((s) => ({
                                value: s.value,
                                label: `${s.emoji} ${s.label}`,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item
                        name="serviceTitle"
                        label="Service title / subject"
                        tooltip="Quick label shown in the admin list (e.g. 'DAC → DXB', 'UAE Tourist Visa')"
                    >
                        <Input placeholder="e.g. DAC → DXB · 2 Pax" maxLength={255} />
                    </Form.Item>
                </div>

                <Form.Item
                    noStyle
                    shouldUpdate={(prev, next) => prev.serviceType !== next.serviceType}
                >
                    {({ getFieldValue }) =>
                        getFieldValue("serviceType") === "tour" ? (
                            <Form.Item name="tourId" label="Tour package">
                                <Select
                                    allowClear
                                    showSearch
                                    loading={toursLoading}
                                    placeholder="Pick a tour package (optional)"
                                    options={tourOptions}
                                    optionFilterProp="label"
                                    notFoundContent={
                                        toursLoading ? "Loading…" : "No tours found"
                                    }
                                />
                            </Form.Item>
                        ) : null
                    }
                </Form.Item>

                <div className="grid gap-x-4 md:grid-cols-2">
                    <Form.Item
                        name="name"
                        label="Full name"
                        rules={[{ required: true, message: "Name is required" }]}
                    >
                        <Input placeholder="Customer name" autoComplete="off" />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Phone number"
                        rules={[
                            { required: true, message: "Phone is required" },
                            {
                                pattern: /^[0-9+\-\s()]{7,20}$/,
                                message: "Enter a valid phone number",
                            },
                        ]}
                    >
                        <Input placeholder="+8801XXXXXXXXX" autoComplete="off" />
                    </Form.Item>
                </div>

                <div className="grid gap-x-4 md:grid-cols-2">
                    <Form.Item
                        name="email"
                        label="Email address (optional)"
                        rules={[{ type: "email", message: "Enter a valid email" }]}
                    >
                        <Input placeholder="customer@example.com" autoComplete="off" />
                    </Form.Item>
                    <Form.Item name="bookingDate" label="Booking date (optional)">
                        <DatePicker className="w-full" format="YYYY-MM-DD" />
                    </Form.Item>
                </div>

                <Form.Item name="source" label="Source / page">
                    <Input placeholder="e.g. tour-cox-bazar, contact-page" />
                </Form.Item>

                <Form.Item name="message" label="Message">
                    <TextArea rows={4} placeholder="Message or special requests" maxLength={4000} showCount />
                </Form.Item>

                {isEdit ? (
                    <>
                        <Form.Item name="status" label="Status">
                            <Select
                                options={BOOKING_STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
                            />
                        </Form.Item>
                        <Form.Item name="notes" label="Internal notes">
                            <TextArea rows={3} placeholder="Visible to admins only" maxLength={4000} />
                        </Form.Item>
                    </>
                ) : null}
            </Form>
        </Modal>
    );
}
