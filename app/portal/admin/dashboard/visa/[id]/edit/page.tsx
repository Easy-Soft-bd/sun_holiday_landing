"use client";

import { useParams } from "next/navigation";
import VisaCountryForm from "../../components/VisaCountryForm";
import VisaFormPageShell from "../../components/VisaFormPageShell";

export default function EditVisaCountryPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <VisaFormPageShell
      title="Edit visa country"
      subtitle="Update the flag, cover, visa guidance, and search snippet. Inactive countries disappear from the public site."
    >
      <VisaCountryForm countryId={id} />
    </VisaFormPageShell>
  );
}
