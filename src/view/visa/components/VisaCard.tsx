"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { VisaService } from "../data/visaData";
import { Clock, Wallet, Calendar } from "lucide-react";
import Image from "next/image";

const ServiceBookingModal = dynamic(
    () => import("@/src/view/booking/ServiceBookingModal"),
    { ssr: false }
);

const currencyFormatter = new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

export default function VisaCard({ visa }: { visa: VisaService }) {
    const [open, setOpen] = useState(false);

    const serviceTitle = `${visa.country} ${visa.category} Visa`;

    return (
        <div className="group bg-white rounded-[2rem] overflow-hidden border border-base-200 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 flex flex-col h-full">
            {/* Image & Category */}
            <div className="relative h-56 overflow-hidden">
                <Image
                    src={visa.image}
                    alt={visa.country}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                    <span className="text-base">{visa.flag}</span>
                    {visa.country}
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <span className="text-sm font-medium bg-primary/90 px-3 py-1 rounded-lg">
                        {visa.category} Visa
                    </span>
                    <div className="flex items-center gap-1 text-sm font-bold">
                        <Wallet size={14} className="text-accent" />
                        BDT {visa.price.toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
                <p className="text-base-content/60 text-sm line-clamp-2 mb-6">
                    {visa.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-xs text-base-content/50">
                        <Clock size={14} className="text-primary" />
                        <span>{visa.processingTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-base-content/50">
                        <Calendar size={14} className="text-primary" />
                        <span>{visa.validity}</span>
                    </div>
                </div>

                <div className="mt-auto pt-6 border-t border-base-100 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="text-sm font-bold text-primary hover:text-secondary transition-colors underline-offset-4 hover:underline"
                    >
                        Requirements
                    </button>
                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-primary transition-all active:scale-95"
                    >
                        Apply Now
                    </button>
                </div>
            </div>

            <ServiceBookingModal
                open={open}
                onClose={() => setOpen(false)}
                serviceType="visa"
                serviceTitle={serviceTitle}
                source={`visa-${visa.id}`}
                details={{
                    country: visa.country,
                    category: visa.category,
                    flag: visa.flag,
                    processingTime: visa.processingTime,
                    validity: visa.validity,
                    price: visa.price,
                }}
                eyebrow="Apply for visa"
                title={`${visa.flag} ${visa.country} ${visa.category} Visa`}
                subtitle={`${visa.processingTime} · Valid ${visa.validity} · ${currencyFormatter.format(
                    visa.price
                )}`}
                summary={[
                    { label: "Country", value: `${visa.flag} ${visa.country}` },
                    { label: "Type", value: `${visa.category} Visa` },
                    { label: "Fee", value: currencyFormatter.format(visa.price) },
                    { label: "Processing", value: visa.processingTime },
                ]}
                requireEmail
                submitLabel="Submit application"
                successTitle="Application received!"
                successDescription="Our visa specialist will contact you within 24 hours with the next steps and document checklist."
            />
        </div>
    );
}
