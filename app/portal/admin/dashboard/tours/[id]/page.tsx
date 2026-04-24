"use client";

import React, { useState, useEffect } from "react";
import { Button, Tag, Descriptions, Card, Spin, message, Image, Empty } from "antd";
import { EditOutlined, ArrowLeftOutlined, EnvironmentOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useParams } from "next/navigation";
import Link from "next/link";
import RichTextHtml from "@/src/components/common/RichTextHtml";
import { normalizeItinerary, normalizeTourPlain, parseJsonArray } from "@/src/lib/tours/normalize-tour";
import type { TourRecord } from "@/src/lib/data/tours";
import type { TourItineraryDay } from "@/src/models/Tour";

const cardCls =
  "!rounded-2xl border border-slate-200/90 bg-white shadow-sm shadow-slate-900/5 [&_.ant-card-head]:!border-slate-100 [&_.ant-card-head]:!min-h-14";

export default function TourDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [tour, setTour] = useState<TourRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchTourData(id as string);
    }
  }, [id]);

  const fetchTourData = async (tourId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/tours/${tourId}`);
      if (response.ok) {
        const raw = (await response.json()) as Record<string, unknown>;
        setTour(normalizeTourPlain(raw) as TourRecord);
      } else {
        message.error("Failed to fetch tour details");
      }
    } catch (error) {
      console.error("Error fetching tour:", error);
      message.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
        <Spin size="large" />
        <p className="text-sm text-slate-500">Loading tour…</p>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-16 text-center text-slate-600">
        Tour not found
      </div>
    );
  }

  const itinerary = normalizeItinerary(tour.itinerary);
  const includes = parseJsonArray<string>(tour.includes);
  const excludes = parseJsonArray<string>(tour.excludes);
  const highlights = parseJsonArray<string>(tour.highlights);
  const galleryRaw = parseJsonArray<string>(tour.gallery);
  const gallery = galleryRaw.filter((url, i) => {
    if (!url?.trim()) return false;
    return galleryRaw.indexOf(url) === i;
  });

  const formatDate = (v: string | Date | undefined) => {
    if (v == null) return null;
    const d = typeof v === "string" ? new Date(v) : v;
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleString();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 pb-16 sm:px-6 lg:px-0">
      <header className="flex flex-col gap-4 border-b border-slate-200/80 pb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <Link
            href="/portal/admin/dashboard/tours"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-primary"
          >
            <ArrowLeftOutlined className="text-xs" />
            All tours
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="mb-0 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{tour.title}</h1>
            <Tag color={tour.status === "Active" ? "green" : tour.status === "Draft" ? "default" : "orange"}>
              {tour.status}
            </Tag>
            <Tag className="!m-0 border-slate-200 bg-slate-50 text-slate-700">{tour.category}</Tag>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <EnvironmentOutlined className="text-primary" />
              {tour.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ClockCircleOutlined className="text-primary" />
              {tour.duration}
            </span>
            <span className="font-medium text-slate-900">৳{tour.price?.toLocaleString()}</span>
          </div>
        </div>
        <Link href={`/portal/admin/dashboard/tours/${id}/edit`} className="shrink-0">
          <Button type="primary" size="large" icon={<EditOutlined />}>
            Edit tour
          </Button>
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <Card title="Overview" className={cardCls}>
            <Descriptions
              bordered
              column={1}
              size="middle"
              styles={{ label: { width: 160, fontWeight: 500 } }}
            >
              <Descriptions.Item label="Tour ID">{tour.id}</Descriptions.Item>
              <Descriptions.Item label="Location">{tour.location}</Descriptions.Item>
              <Descriptions.Item label="Duration">{tour.duration}</Descriptions.Item>
              <Descriptions.Item label="Category">{tour.category}</Descriptions.Item>
              <Descriptions.Item label="Status">{tour.status}</Descriptions.Item>
              <Descriptions.Item label="Price">৳{tour.price?.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Rating">{tour.rating ?? "—"}</Descriptions.Item>
              <Descriptions.Item label="Reviews">{tour.reviews ?? "—"}</Descriptions.Item>
              <Descriptions.Item label="Inquiry phone">{tour.inquiryPhone?.trim() || "—"}</Descriptions.Item>
              <Descriptions.Item label="Video URL">
                {tour.videoUrl?.trim() ? (
                  <a href={tour.videoUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {tour.videoUrl}
                  </a>
                ) : (
                  "—"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Main image URL">
                <span className="break-all text-sm">{tour.image}</span>
              </Descriptions.Item>
              {formatDate(tour.createdAt) ? (
                <Descriptions.Item label="Created">{formatDate(tour.createdAt)}</Descriptions.Item>
              ) : null}
              {formatDate(tour.updatedAt) ? (
                <Descriptions.Item label="Updated">{formatDate(tour.updatedAt)}</Descriptions.Item>
              ) : null}
            </Descriptions>
            <div className="mt-6 rounded-xl bg-slate-50/80 p-5 ring-1 ring-slate-200/60">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Description</h3>
              <div className="text-slate-700 [&_.prose]:!text-slate-700">
                <RichTextHtml html={tour.description} className="!prose-base" />
              </div>
            </div>
          </Card>

          <Card
            title={`Gallery${gallery.length ? ` (${gallery.length})` : ""}`}
            className={cardCls}
          >
            {gallery.length === 0 ? (
              <Empty description="No gallery images" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <Image.PreviewGroup>
                <div className="flex flex-wrap gap-3">
                  {gallery.map((src, index) => (
                    <Image
                      key={`${src}-${index}`}
                      src={src}
                      alt={`Gallery ${index + 1}`}
                      width={140}
                      height={140}
                      className="!h-[140px] !w-[140px] rounded-lg object-cover ring-1 ring-slate-200"
                    />
                  ))}
                </div>
              </Image.PreviewGroup>
            )}
          </Card>

          <Card title={`Highlights${highlights.length ? ` (${highlights.length})` : ""}`} className={cardCls}>
            {highlights.length === 0 ? (
              <Empty description="No highlights" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <ul className="m-0 space-y-2 pl-5">
                {highlights.map((item: string, index: number) => (
                  <li key={index} className="list-disc text-slate-700 marker:text-primary">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Itinerary" className={cardCls}>
            {itinerary.length === 0 ? (
              <p className="text-sm text-slate-500">No itinerary days yet.</p>
            ) : (
              <div className="space-y-4">
                {itinerary.map((item: TourItineraryDay, index: number) => (
                  <div
                    key={index}
                    className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-sm">
                        {item.day}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="mb-2 text-base font-semibold text-slate-900">{item.title}</h4>
                      <div className="text-sm text-slate-600 [&_.prose]:!text-sm [&_.prose]:!text-slate-600">
                        <RichTextHtml html={item.description} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card title={`Includes${includes.length ? ` (${includes.length})` : ""}`} className={cardCls}>
              {includes.length === 0 ? (
                <Empty description="No includes" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                <ul className="m-0 space-y-2 pl-5 text-slate-700">
                  {includes.map((item: string, index: number) => (
                    <li key={index} className="list-disc marker:text-emerald-600">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
            <Card title={`Excludes${excludes.length ? ` (${excludes.length})` : ""}`} className={cardCls}>
              {excludes.length === 0 ? (
                <Empty description="No excludes" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                <ul className="m-0 space-y-2 pl-5 text-slate-700">
                  {excludes.map((item: string, index: number) => (
                    <li key={index} className="list-disc text-red-700 marker:text-red-400">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </div>

        <aside className="space-y-6">
          <Card title="Main image" className={cardCls}>
            <Image
              src={tour.image}
              alt={tour.title}
              className="!w-full rounded-xl object-cover"
              style={{ maxHeight: 280 }}
            />
          </Card>

          {tour.videoUrl?.trim() ? (
            <Card title="Video" className={cardCls}>
              <a
                href={tour.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-sm font-medium text-primary hover:underline"
              >
                {tour.videoUrl}
              </a>
            </Card>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
