"use client";

import { usePathname } from "next/navigation";
import React from "react";

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const needsPadding = pathname !== "/"; // agrega padding solo fuera de la home
  return <main className={needsPadding ? "pt-16 md:pt-20" : ""}>{children}</main>;
}