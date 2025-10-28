"use client";

import React from "react";

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  return <main className="pt-16 md:pt-20">{children}</main>;
}