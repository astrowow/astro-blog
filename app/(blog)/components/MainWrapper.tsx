"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const rawPathname = usePathname() || "/";
  const [needsPadding, setNeedsPadding] = useState(false);

  // Evita el salto inicial: por defecto sin padding y decide tras montar
  useEffect(() => {
    const normalized = rawPathname
      .replace(/\/\([^/]+?\)(?=\/|$)/g, "") // elimina segmentos de grupo
      .replace(/\/+$/, ""); // elimina slash final (excepto en root)
    const path = normalized === "" ? "/" : normalized;
    setNeedsPadding(path !== "/");
  }, [rawPathname]);

  return <main className={needsPadding ? "pt-16 md:pt-20" : ""}>{children}</main>;
}