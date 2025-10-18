"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import * as demo from "@/sanity/lib/demo";
import { sanityFetchClient } from "@/sanity/lib/fetch-client";
import { settingsQuery } from "@/sanity/lib/queries";
import { useMenu } from "./MenuContext";

export default function SiteTitle({ className }: { className?: string }) {
  const [settings, setSettings] = useState<any>(null);
  const { openMenu } = useMenu();

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await sanityFetchClient({ query: settingsQuery, stega: false });
      setSettings(data);
    };
    fetchSettings();
  }, []);

  return (
    <h2
      className={[
        "mb-16 mt-10 grid grid-cols-[1fr_auto] items-center justify-between gap-x-4 font-bold leading-tight tracking-tight text-2xl md:text-4xl md:tracking-tighter",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Link href="/" className="hover:underline">
        {settings?.title || demo.title}
      </Link>
      {/* Solo el texto 'Menu' como disparador del overlay */}
      <button
        type="button"
        onClick={openMenu}
        className="hover:underline"
        aria-label="Abrir menú"
      >
        Menu
      </button>
    </h2>
  );
}