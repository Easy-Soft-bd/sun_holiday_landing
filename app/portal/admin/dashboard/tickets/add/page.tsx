"use client";

import TicketRouteForm from "../components/TicketRouteForm";
import TicketFormPageShell from "../components/TicketFormPageShell";

export default function AddTicketRoutePage() {
  return (
    <TicketFormPageShell
      title="Add ticket route"
      subtitle="Active routes show as cards on the Ticket page. Each card opens a name and phone inquiry."
    >
      <TicketRouteForm />
    </TicketFormPageShell>
  );
}
