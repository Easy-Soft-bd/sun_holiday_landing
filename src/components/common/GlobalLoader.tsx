"use client";

import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";

const GlobalLoader = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        const handleLoad = () => {
            timeoutId = setTimeout(() => setIsLoading(false), 120);
        };

        if (document.readyState === "complete") {
            handleLoad();
        } else {
            window.addEventListener("load", handleLoad);
        }

        return () => {
            window.removeEventListener("load", handleLoad);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, []);

    return <LoadingScreen show={isLoading} />;
};

export default GlobalLoader;
