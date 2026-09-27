const LINKS = [
  { href: "#overview", label: "Overview" },
  { href: "#master-plan", label: "Master Plan" },
  { href: "#investment-model", label: "Investment Model" },
  { href: "#opportunity", label: "Opportunity" },
  { href: "#roadmap", label: "Roadmap" },
  { href: "#why-sunvia", label: "Why Sunvia" },
  { href: "#faq", label: "FAQ" },
  { href: "#lead", label: "Contact" },
];

export default function PageNav() {
  return (
    <nav
      aria-label="Sunvia Hotel and Resort sections"
      className="sticky top-[calc(var(--banner-height,0px)+5rem)] z-40 border-b border-base-300 bg-base-100/90 backdrop-blur-md"
    >
      <div
        className="container mx-auto flex gap-2 overflow-x-auto px-4 py-3 lg:px-8 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="shrink-0 rounded-full border border-base-300 bg-base-100 px-4 py-2 text-sm font-semibold text-base-content transition-colors hover:border-primary hover:bg-primary hover:text-primary-content"
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
