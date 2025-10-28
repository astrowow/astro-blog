"use client";

import { enableVisualEditing } from "@sanity/visual-editing";
import { useEffect } from "react";

export default function VisualEditingWrapper() {
  useEffect(() => {
    const disable = enableVisualEditing();
    return disable;
  }, []);
  
  return null;
}