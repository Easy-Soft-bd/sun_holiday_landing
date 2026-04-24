"use client";

import { useParams } from "next/navigation";
import AddTourForm from "@/app/portal/admin/dashboard/tours/add/components/AddTourForm";
import TourFormPageShell from "@/app/portal/admin/dashboard/tours/add/components/TourFormPageShell";

export default function EditTourPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <TourFormPageShell
      title="Edit tour package"
      subtitle="Update content anytime. Lists, bold, and other toolbar styles are visible while you type."
    >
      <AddTourForm tourId={id} />
    </TourFormPageShell>
  );
}
