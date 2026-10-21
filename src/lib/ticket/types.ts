/** Public card shape. Safe to pass from a server page into client components. */
export type PublicTicketRoute = {
  id: number;
  from: string;
  to: string;
  airline: string | null;
  priceFrom: number | null;
  image: string | null;
  note: string | null;
};
