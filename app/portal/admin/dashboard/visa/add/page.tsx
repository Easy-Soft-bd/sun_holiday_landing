"use client";

import VisaCountryForm from "../components/VisaCountryForm";
import VisaFormPageShell from "../components/VisaFormPageShell";

export default function AddVisaCountryPage() {
  return (
    <VisaFormPageShell
      title="Add visa country"
      subtitle="Published countries appear on the Visa page, the homepage, and their own search page. Drafts stay private."
    >
      <VisaCountryForm />
    </VisaFormPageShell>
  );
}
