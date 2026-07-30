"use client";

import { App, Button, Card, Form, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import BasicInfoSection from "./sections/BasicInfoSection";
import GallerySection from "./sections/GallerySection";
import HighlightsIncludesSection from "./sections/HighlightsIncludesSection";
import ItinerarySection from "./sections/ItinerarySection";
import MediaDescriptionSection from "./sections/MediaDescriptionSection";
import type { TourFormValues } from "./types";
import { normalizeTourPlain } from "@/src/lib/tours/normalize-tour";

const INITIAL_VALUES: Partial<TourFormValues> = {
  status: "Draft",
  category: "Domestic",
  showOnHome: false,
  homeSortOrder: 0,
};

const cardClass = "!rounded-2xl border border-slate-200/90 bg-white shadow-sm shadow-slate-900/5";
const cardHeadClass = "!border-b !border-slate-100 !py-4 !px-6";
const cardBodyClass = "!px-6 !pb-6 !pt-2";

type AddTourFormProps = {
  /** When set, form loads this tour and submits a PUT. */
  tourId?: string;
};

export default function AddTourForm({ tourId }: AddTourFormProps) {
  const { message } = App.useApp();
  const [form] = Form.useForm<TourFormValues>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [bootLoading, setBootLoading] = useState(Boolean(tourId));
  /** Full API record for edit merges (keeps rating, reviews, etc. not on the form). */
  const editBaselineRef = useRef<Record<string, unknown> | null>(null);

  const isEdit = Boolean(tourId);

  useEffect(() => {
    if (!tourId) {
      editBaselineRef.current = null;
      setBootLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setBootLoading(true);
      try {
        const res = await fetch(`/api/tours/${tourId}`);
        if (!res.ok) {
          message.error("Failed to load tour");
          return;
        }
        const raw = (await res.json()) as Record<string, unknown>;
        if (!cancelled) {
          const normalized = normalizeTourPlain(raw);
          editBaselineRef.current = normalized as Record<string, unknown>;
          const { location: _legacyLocation, ...forForm } = normalized as Record<string, unknown>;
          form.setFieldsValue(forForm as TourFormValues);
        }
      } catch {
        message.error("Failed to load tour");
      } finally {
        if (!cancelled) {
          setBootLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [tourId, form]);

  const onFinish = async (values: TourFormValues) => {
    setLoading(true);
    try {
      const formPayload = {
        ...values,
        highlights: values.highlights || [],
        includes: values.includes || [],
        excludes: values.excludes || [],
        gallery: values.gallery || [],
        itinerary: values.itinerary || [],
      };

      const merged =
        isEdit && editBaselineRef.current
          ? { ...editBaselineRef.current, ...formPayload }
          : formPayload;
      const { location: _omitLegacyLocation, ...payload } = merged as Record<string, unknown>;

      const url = isEdit ? `/api/tours/${tourId}` : "/api/tours";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        message.error(isEdit ? "Failed to update tour" : "Failed to create tour");
        return;
      }

      message.success(isEdit ? "Tour updated successfully" : "Tour created successfully");
      router.push("/portal/admin/dashboard/tours");
    } catch (error) {
      console.error("Error saving tour:", error);
      message.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} initialValues={INITIAL_VALUES} requiredMark="optional">
      {bootLoading ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
          <Spin size="large" />
          <p className="text-sm text-slate-500">Loading tour…</p>
        </div>
      ) : (
        <>
          <Card
            title="Basic information"
            className={cardClass}
            classNames={{ header: cardHeadClass, body: cardBodyClass }}
          >
            <BasicInfoSection tourId={tourId} autoSlugFromTitle={!tourId} />
          </Card>

          <Card
            title="Media & description"
            className={`${cardClass} mt-6`}
            classNames={{ header: cardHeadClass, body: cardBodyClass }}
          >
            <MediaDescriptionSection form={form} />
          </Card>

          <Card
            title="Image gallery"
            className={`${cardClass} mt-6`}
            classNames={{ header: cardHeadClass, body: cardBodyClass }}
          >
            <GallerySection form={form} />
          </Card>

          <Card
            title="Highlights & inclusions"
            className={`${cardClass} mt-6`}
            classNames={{ header: cardHeadClass, body: cardBodyClass }}
          >
            <HighlightsIncludesSection />
          </Card>

          <Card
            title="Itinerary"
            className={`${cardClass} mt-6`}
            classNames={{ header: cardHeadClass, body: cardBodyClass }}
          >
            <ItinerarySection />
          </Card>

          <div className="sticky bottom-0 z-10 mt-10 flex justify-end border-t border-slate-200 bg-gradient-to-t from-white via-white to-transparent pt-6">
            <Button type="primary" htmlType="submit" loading={loading} size="large" className="min-w-[160px]">
              {isEdit ? "Save changes" : "Create tour"}
            </Button>
          </div>
        </>
      )}
    </Form>
  );
}
