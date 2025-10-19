"use client";

import { usePathname } from "next/navigation";
import React, { useMemo } from "react";

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const rawPathname = usePathname() || "/";

  // Normaliza el pathname para ignorar route groups (p.ej. /(blog)) y trailing slashes
  const pathname = useMemo(() => {
    const normalized = rawPathname
      .replace(/\/\([^/]+?\)(?=\/|$)/g, "") // elimina segmentos de grupo
      .replace(/\/+$/, ""); // elimina slash final (excepto en root)
    return normalized === "" ? "/" : normalized;
  }, [rawPathname]);

  const needsPadding = pathname !== "/"; // agrega padding solo fuera de la home
  return <main className={needsPadding ? "pt-16 md:pt-20" : ""}>{children}</main>;
}