"use client";

import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";

const GlobalLoader = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleLoad = () => {
            // Extend delay to ensure users see the branding (logo) and prevent rapid flashing
            setTimeout(() => setIsLoading(false), 2500);
        };

        if (document.readyState === "complete") {
            handleLoad();
        } else {
            window.addEventListener("load", handleLoad);
            return () => window.removeEventListener("load", handleLoad);
        }
    },[]);

    return <LoadingScreen show={isLoading} />;
};

export default GlobalLoader;
