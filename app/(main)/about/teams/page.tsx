
import { Metadata } from "next";
import TeamsView from "@/src/view/about/teams/TeamsView";
import { buildPageMetadata } from "@/src/lib/site";

export const metadata: Metadata = buildPageMetadata({
    title: "Our Team - Sun Holidays Ltd | Board of Directors & Experts",
    description: "Meet the leadership and dedicated professionals at Sun Holidays Ltd. From our Board of Directors to our Travel Consultants, we are here to serve you.",
    path: "/about/teams",
    keywords: ["Sun Holidays Team", "Board of Directors", "Md. Ferdous", "Sayed Zillur Rahman", "Md. Asaduzzaman", "Travel Experts"],
});

export default function TeamsPage() {
    return <TeamsView />;
}
