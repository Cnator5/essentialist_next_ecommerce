"use client"
import React, { useEffect, useState } from "react";

const useMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(false); // Initialize as false

    const handleResize = () => {
        if (typeof window !== 'undefined') {
            const checkpoint = window.innerWidth < breakpoint;
            setIsMobile(checkpoint);
        }
    };

    useEffect(() => {
        handleResize(); // Check size on mount

        window.addEventListener('resize', handleResize); // Add event listener

        return () => {
            window.removeEventListener('resize', handleResize); // Cleanup
        };
    }, []);

    return [isMobile];
};

export default useMobile;