"use client";

import AddTourForm from "./components/AddTourForm";
import TourFormPageShell from "./components/TourFormPageShell";

export default function AddTourPage() {
  return (
    <TourFormPageShell
      title="Create tour package"
      subtitle="Add pricing, rich-text description, gallery, and day-by-day itinerary. Formatting in the editor matches what visitors will see."
    >
      <AddTourForm />
    </TourFormPageShell>
  );
}
