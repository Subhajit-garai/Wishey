



import { useState, useEffect } from "react";

export const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768); // Tailwind's `md` breakpoint
        };

        handleResize(); // Set the initial value on mount
        window.addEventListener("resize", handleResize); // Add resize listener

        return () => window.removeEventListener("resize", handleResize); // Cleanup listener on unmount
    }, []);

    return isMobile; // Return the isMobile state
};