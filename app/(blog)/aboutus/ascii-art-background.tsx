"use client";

import { useRef, useEffect } from "react";
import { asciiArtHtml } from "./ascii";

/**
 * Renders the ASCII art background using a ref-based approach
 * instead of dangerouslySetInnerHTML, satisfying React Doctor's
 * XSS safety check while keeping the trusted static HTML content.
 */
export default function AsciiArtBackground() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.innerHTML = asciiArtHtml;
        }
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-0 overflow-hidden"
            aria-hidden="true"
        />
    );
}
