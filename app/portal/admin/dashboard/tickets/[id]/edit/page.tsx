"use client";

import { useParams } from "next/navigation";
import TicketRouteForm from "../../components/TicketRouteForm";
import TicketFormPageShell from "../../components/TicketFormPageShell";

export default function EditTicketRoutePage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <TicketFormPageShell
      title="Edit ticket route"
      subtitle="Inactive routes stay in the dashboard and disappear from the public Ticket page."
    >
      <TicketRouteForm routeId={id} />
    </TicketFormPageShell>
  );
}
