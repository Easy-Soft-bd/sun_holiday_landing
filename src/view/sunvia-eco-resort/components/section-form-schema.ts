import type { ResortSectionKey } from "@/src/lib/data/sunvia-eco-resort";

export type TextField = {
  kind: "text" | "textarea";
  name: string;
  label: string;
};

export type ImageField = {
  kind: "image";
  name: string;
  label: string;
};

export type KeywordsField = {
  kind: "keywords";
  name: "metaKeywordsText";
  label: string;
};

export type SelectField = {
  kind: "select";
  name: string;
  label: string;
  options: { label: string; value: string }[];
};

export type StringListField = {
  kind: "stringList";
  name: string;
  label: string;
  addLabel: string;
};

export type ObjectListField = {
  kind: "list";
  name: string;
  label: string;
  addLabel: string;
  itemFields: Array<TextField | SelectField | ImageField>;
};

export type SectionField = TextField | ImageField | KeywordsField | StringListField | ObjectListField;

function text(name: string, label: string): TextField {
  return { kind: "text", name, label };
}

function area(name: string, label: string): TextField {
  return { kind: "textarea", name, label };
}

function lines(name: string, label: string, addLabel: string): StringListField {
  return { kind: "stringList", name, label, addLabel };
}

function photo(name: string, label: string): ImageField {
  return { kind: "image", name, label };
}

function cards(name: string, label: string, addLabel: string, fields: Array<TextField | SelectField | ImageField>): ObjectListField {
  return { kind: "list", name, label, addLabel, itemFields: fields };
}

export const SECTION_FORMS: Record<ResortSectionKey, SectionField[]> = {
  investor_seo: [
    text("metaTitle", "Meta title"),
    area("metaDescription", "Meta description"),
    { kind: "keywords", name: "metaKeywordsText", label: "Keywords, separated by commas" },
    { kind: "image", name: "metaImage", label: "Social image" },
  ],
  investor_hero: [
    text("projectName", "Project name"),
    text("eyebrow", "Eyebrow"),
    area("headline", "Headline"),
    area("supportLine", "Support line"),
    text("unitLabel", "Investment unit label"),
    text("unitValue", "Investment unit"),
    text("paymentLabel", "Payment label"),
    text("paymentValue", "Payment facility"),
    { kind: "image", name: "backgroundImage", label: "Background image" },
    text("ctaPrimaryText", "Primary button"),
    text("ctaPrimaryHref", "Primary button link"),
    text("ctaSecondaryText", "WhatsApp button"),
    text("whatsappNumber", "WhatsApp number"),
    area("whatsappMessage", "WhatsApp prefilled message"),
  ],
  master_plan: [
    text("eyebrow", "Eyebrow"),
    text("heading", "Heading"),
    area("description", "Description"),
    { kind: "image", name: "image", label: "Plan image" },
    text("imageAlt", "Image description"),
    cards("highlights", "Highlights", "Add highlight", [
      text("value", "Value"),
      text("label", "Label"),
      photo("image", "Card photo"),
    ]),
    lines("labels", "Plan labels", "Add label"),
    cards("zones", "Zones", "Add zone", [text("title", "Title"), area("description", "Description")]),
    area("caption", "Caption"),
  ],
  investment_model: [
    text("eyebrow", "Eyebrow"),
    text("heading", "Heading"),
    lines("steps", "Model steps", "Add step"),
    text("revenueLabel", "Revenue heading"),
    lines("revenueSources", "Revenue sources", "Add source"),
    photo("backgroundImage", "Revenue card photo"),
    area("disclosure", "Disclosure"),
  ],
  investment: [
    text("eyebrow", "Eyebrow"),
    text("heading", "Heading"),
    area("description", "Description"),
    text("unitLabel", "Unit label"),
    text("unitValue", "Unit value"),
    text("ownershipTitle", "Ownership title"),
    area("ownershipText", "Ownership text"),
    text("profitTitle", "Profit title"),
    area("profitText", "Profit text"),
    text("paymentLabel", "Payment label"),
    text("paymentValue", "Payment facility"),
    area("note", "Note"),
    text("ctaText", "Button"),
    text("ctaHref", "Button link"),
  ],
  demand: [
    text("eyebrow", "Eyebrow"),
    text("heading", "Heading"),
    area("description", "Description"),
    cards("items", "Segments", "Add segment", [text("title", "Title"), area("description", "Description")]),
  ],
  roadmap: [
    text("eyebrow", "Eyebrow"),
    text("heading", "Heading"),
    lines("steps", "Stages", "Add stage"),
  ],
  why_sunvia: [
    text("eyebrow", "Eyebrow"),
    text("heading", "Heading"),
    text("projectName", "Project name"),
    text("affiliation", "Affiliation"),
    area("description", "Description"),
    text("ctaText", "WhatsApp button"),
    text("whatsappNumber", "WhatsApp number"),
    area("whatsappMessage", "WhatsApp prefilled message"),
    photo("backgroundImage", "Background photo"),
  ],
  terms: [
    text("eyebrow", "Eyebrow"),
    text("heading", "Heading"),
    cards("items", "Terms", "Add term", [text("title", "Title"), area("description", "Description")]),
  ],
  faq: [
    text("eyebrow", "Eyebrow"),
    text("heading", "Heading"),
    cards("items", "Questions", "Add question", [area("question", "Question"), area("answer", "Answer")]),
  ],
  lead: [
    text("eyebrow", "Eyebrow"),
    text("heading", "Heading"),
    area("description", "Description"),
    text("namePlaceholder", "Name placeholder"),
    text("phonePlaceholder", "Phone placeholder"),
    text("contactLabel", "Contact field label"),
    cards("contactOptions", "Contact options", "Add option", [text("label", "Label"), text("value", "Value")]),
    text("interestLabel", "Interest field label"),
    cards("interestOptions", "Interest options", "Add option", [text("label", "Label"), text("value", "Value")]),
    area("consentText", "Consent text"),
    text("privacyLabel", "Privacy link label"),
    text("privacyHref", "Privacy link"),
    text("submitText", "Submit button"),
    text("mobileCtaText", "Mobile bar button"),
    area("successMessage", "Success message"),
    area("errorMessage", "Error message"),
    text("whatsappLabel", "WhatsApp button"),
    text("whatsappNumber", "WhatsApp number"),
    area("whatsappMessage", "WhatsApp prefilled message"),
    text("source", "Lead source label"),
  ],
};

export function blankListItem(field: ObjectListField) {
  return Object.fromEntries(
    field.itemFields.map((item) => [item.name, item.kind === "select" ? item.options[0]?.value ?? "" : ""]),
  );
}
