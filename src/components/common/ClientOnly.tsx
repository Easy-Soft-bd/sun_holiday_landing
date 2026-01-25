"use client";

import { useEffect, useState, ReactNode } from "react";

interface ClientOnlyProps {
    children: ReactNode;
}

/**
 * A wrapper component that only renders its children on the client side
 * after the component has mounted. This prevents hydration errors for
 * components that produce different output on the server and client.
 */
export default function ClientOnly({ children }: ClientOnlyProps) {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        return null;
    }

    return <>{children}</>;
}
