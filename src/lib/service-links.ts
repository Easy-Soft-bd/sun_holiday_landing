export const MEDICAL_VISA_LINK = {
  label: "Medical Visa",
  url: "/medical-visa",
};

export const EDUCATION_LINK = {
  label: "Sun Global Education",
  url: "/sun-global-education",
};

type ServiceLink = {
  label: string;
  url: string;
};

export function ensureMedicalVisaLink(links: ServiceLink[]): ServiceLink[] {
  if (links.some((link) => link.url === MEDICAL_VISA_LINK.url)) {
    return links;
  }
  const visaIndex = links.findIndex((link) => link.url === "/visa");
  const next = [...links];
  next.splice(visaIndex >= 0 ? visaIndex + 1 : next.length, 0, { ...MEDICAL_VISA_LINK });
  return next;
}

export function ensureEducationLink(links: ServiceLink[]): ServiceLink[] {
  if (links.some((link) => link.url === EDUCATION_LINK.url)) {
    return links;
  }
  const medicalIndex = links.findIndex((link) => link.url === MEDICAL_VISA_LINK.url);
  const visaIndex = links.findIndex((link) => link.url === "/visa");
  const next = [...links];
  const insertAt = medicalIndex >= 0 ? medicalIndex + 1 : visaIndex >= 0 ? visaIndex + 1 : next.length;
  next.splice(insertAt, 0, { ...EDUCATION_LINK });
  return next;
}
