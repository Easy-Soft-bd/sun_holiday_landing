import { Metadata } from "next";
import NotFoundClient from "./not-found-client";

export const metadata: Metadata = {
    title: "404 - Page Not Found | Sun Holidays",
    description: "Sorry, the holiday destination you are looking for doesn't exist.",
};

export default function NotFound() {
    return <NotFoundClient />;
}