
import { Metadata } from "next";
import TeamsView from "@/src/view/about/teams/TeamsView";
import { buildPageMetadata } from "@/src/lib/site";
import { getCachedAdminStatus, getCachedHomePageData } from "@/src/lib/get-page-data";

export const metadata: Metadata = buildPageMetadata({
    title: "Our Team - Sun Tourism Ltd | Board of Directors & Experts",
    description: "Meet the leadership and dedicated professionals at Sun Tourism Ltd. From our Board of Directors to our Travel Consultants, we are here to serve you.",
    path: "/about/teams",
    keywords: ["Sun Holidays Team", "Board of Directors", "Md. Ferdous", "Sayed Zillur Rahman", "Md. Asaduzzaman", "Travel Experts"],
});

export default async function TeamsPage() {
    const [admin, pageData] = await Promise.all([
        getCachedAdminStatus(),
        getCachedHomePageData(),
    ]);
    return <TeamsView data={pageData?.about_teams_page} admin={admin} />;
}
