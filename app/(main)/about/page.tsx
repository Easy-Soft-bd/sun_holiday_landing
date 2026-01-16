import { Metadata } from "next";
import AboutView from "@/src/view/about/AboutView";

export const metadata: Metadata = {
    title: "About Us - Sun Holidays Ltd | Your Trusted Travel Partner",
    description: "Discover the story of Sun Holidays Ltd, founded in 2021. Our vision is to be the first choice for travelers, providing service with care and empathy.",
    keywords: ["About Sun Holidays", "Travel Agency Bangladesh", "Sun Holidays Ltd", "Tour Operator Dhaka"]
};

export default function About() {
  return <AboutView />
}