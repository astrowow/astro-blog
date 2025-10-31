"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import * as demo from "@/sanity/lib/demo";
import { sanityFetchClient } from "@/sanity/lib/fetch-client";
import { settingsQuery } from "@/sanity/lib/queries";
import { useMenu } from "./MenuContext";

export default function SiteTitle({ className }: { className?: string }) {
  const [settings, setSettings] = useState<any>(null);
  const { isMenuOpen, toggleMenu } = useMenu();

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await sanityFetchClient({ query: settingsQuery, stega: false });
      setSettings(data);
    };
    fetchSettings();
  }, []);

  const colorClass = isMenuOpen ? "text-[var(--cream)]" : "text-[var(--black)]";

  return (
    <h2
      className={[
        "grid grid-cols-[1fr_auto] items-center justify-between gap-x-4 py-0 font-bold tracking-tight text-2xl md:text-3xl",
        colorClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Link href="/" className="hover:underline">
        {(settings?.title || demo.title).split("").map((ch: string, idx: number) => (
          <span
            key={idx}
            className={["text-[#F1C21E]", "text-[#045396]", "text-[#E83B13]", "text-[#09935F]"][idx % 4]}
          >
            {ch}
          </span>
        ))}
      </Link>
      <button
        type="button"
        onClick={toggleMenu}
        className="hover:underline"
        aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {(isMenuOpen ? "Cerrar" : "Menú").split("").map((ch: string, idx: number) => (
          <span
            key={idx}
            className={["text-[#F1C21E]", "text-[#045396]", "text-[#E83B13]", "text-[#09935F]"][idx % 4]}
          >
            {ch}
          </span>
        ))}
      </button>
    </h2>
  );
}