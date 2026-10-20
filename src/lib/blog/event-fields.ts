export type EventFields = {
  eventDate: string | null;
  eventLocation: string | null;
};

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export function readEventFields(
  category: string,
  body: Record<string, unknown>,
): { fields: EventFields; error?: string } {
  if (category !== "Event") {
    return { fields: { eventDate: null, eventLocation: null } };
  }

  const rawDate = typeof body.eventDate === "string" ? body.eventDate.trim().slice(0, 10) : "";
  const location = typeof body.eventLocation === "string" ? body.eventLocation.trim() : "";

  if (!DATE_ONLY.test(rawDate)) {
    return {
      fields: { eventDate: null, eventLocation: null },
      error: "Event date is required.",
    };
  }

  const parsed = new Date(`${rawDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return {
      fields: { eventDate: null, eventLocation: null },
      error: "Event date is required.",
    };
  }

  if (!location) {
    return {
      fields: { eventDate: null, eventLocation: null },
      error: "Event location is required.",
    };
  }

  return {
    fields: {
      eventDate: rawDate,
      eventLocation: location.slice(0, 200),
    },
  };
}
