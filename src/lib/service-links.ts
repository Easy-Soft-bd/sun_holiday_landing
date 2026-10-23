export const MEDICAL_VISA_LINK = {
  label: "Medical Visa",
  url: "/medical-visa",
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
